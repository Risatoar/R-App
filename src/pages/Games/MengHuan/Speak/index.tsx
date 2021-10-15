import styles from "./index.module.scss";
import {
  Collapse,
  List,
  Form,
  Modal,
  Input,
  TreeSelect,
  InputNumber,
  Radio,
  message,
  PageHeader,
} from "antd";
import { autoSpeakState, dbState } from "@/models/game/menghuan/speak";
import { productState } from "@/models/game/menghuan/product";
import { useRecoilState } from "recoil";
import useMounted from "@/hooks/useMounted";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import { ipcRenderer, uuid } from "@/utils";
import cronJob, { JobInstance } from "@/utils/scheduler";
import { useState } from "react";
import { cloneDeep } from "lodash";

const { Panel } = Collapse;

const parseTreeData = (data: any[] | any, parentKey = "") => {
  if (!data) {
    return null;
  }
  if (!data.data) {
    return (
      <TreeSelect.TreeNode
        selectable={true}
        value={parentKey ? `${parentKey}.${data.id}` : data.id}
        title={data.name}
      />
    );
  }
  const children = data.data.map((child: any) =>
    parseTreeData(child, parentKey ? `${parentKey}.${data.id}` : data.id)
  );
  return (
    <TreeSelect.TreeNode selectable={false} value={data.id} title={data.name}>
      {children}
    </TreeSelect.TreeNode>
  );
};

const AutoSpeak = () => {
  const [data, setData] = useRecoilState(autoSpeakState);
  const [product] = useRecoilState(productState);
  const [job, setJob] = useState<Record<string, JobInstance>>({});
  const [db] = useRecoilState(dbState);
  const [form] = Form.useForm();

  useMounted(() => {
    db?.onDataChange(setData);

    db?.query({ where: "*" });
  });

  const formatDepToTemplate = (
    template: string,
    dependency: game_mh_auto_speak.AutoSpeakModel["dependency"]
  ) => {
    let tempStr = template;

    if (dependency?.length === 0) {
      return tempStr;
    }

    const dependencyData = dependency?.map((dep) => {
      const paths = dep.split(".");
      try {
        return product
          .find(({ id }) => id === paths[0])
          ?.data?.find(({ id }) => id === paths[1])
          ?.data?.find(({ id }) => id === paths[2])?.price;
      } catch (error) {
        return 0;
      }
    });

    dependencyData?.forEach((e, i) => {
      tempStr = tempStr?.replace(`{${i}}`, e as string);
    });

    return tempStr;
  };

  const handleSpeakAddOrUpdate = (item?: game_mh_auto_speak.AutoSpeakModel) => {
    if (!item) {
      form.resetFields();
    } else {
      form.setFieldsValue(item);
    }

    Modal.confirm({
      title: "自动喊话设置",
      content: (
        <Form form={form}>
          <Form.Item name="name" label="名称" required>
            <Input />
          </Form.Item>
          <Form.Item name="template" label="模版" required>
            <Input placeholder="60环 {0}w 70环 {1}w" />
          </Form.Item>
          <Form.Item name="dependency" label="依赖">
            <TreeSelect allowClear multiple showSearch>
              {product.map((it) => parseTreeData(it))}
            </TreeSelect>
          </Form.Item>
          <Form.Item label="定时任务设置">
            <Form.Item name={["jobConfig", "type"]}>
              <Radio.Group>
                <Radio value="interval">周期任务</Radio>
                <Radio value="once">单次任务</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="任务间隔（ms）" name={["jobConfig", "time"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item label="持续时长（ms）" name={["jobConfig", "duration"]}>
              <InputNumber />
            </Form.Item>
            <Form.Item></Form.Item>
          </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const formData = await form.validateFields();

        if (!item) {
          db?.add(
            { where: "*" },
            {
              id: uuid(),
              ...formData,
            }
          );
        } else {
          db?.update(
            { where: item.id },
            {
              ...item,
              ...formData,
            }
          );
        }
      },
    });
  };

  const handleSpeakDelete = (id: string) => {
    db?.remove({ where: id });
  };

  const handleCronJobStart = (item: game_mh_auto_speak.AutoSpeakModel) => {
    let jobInstance = job[item.id];
    if (!jobInstance) {
      jobInstance = cronJob.register({
        ...item.jobConfig!,
        callback: () => {
          ipcRenderer?.send("asynchronous-message", {
            type: "auto-keyboard",
            extraMap: {
              type: "mh-auto-speak",
              message: formatDepToTemplate(item.template!, item.dependency),
            },
          });
        },
      });

      setJob({ ...job, [item.id]: jobInstance });
    }

    jobInstance.start();

    message.success(`自动喊话任务: ${item.name}, 开始执行`);
  };

  const handleCronJobStop = (item: game_mh_auto_speak.AutoSpeakModel) => {
    job[item.id]?.remove();

    const cloneJob = cloneDeep(job);

    delete cloneJob[item.id];

    setJob(cloneJob);

    message.warning(`自动喊话任务: ${item.name}, 停止执行`);
  };

  return (
    <>
      <PageHeader title="自动喊话" />
      <div className={styles.container}>
        <Collapse>
          <Panel
            header="自动喊话"
            key="autoSpeak"
            extra={
              <PlusCircleOutlined onClick={() => handleSpeakAddOrUpdate()} />
            }
          >
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <EditOutlined
                      onClick={() => handleSpeakAddOrUpdate(item)}
                    />,
                    <DeleteOutlined
                      onClick={() => handleSpeakDelete(item.id!)}
                    />,
                    job[item.id!] ? (
                      <PauseCircleOutlined
                        onClick={() => handleCronJobStop(item)}
                      />
                    ) : (
                      <PlayCircleOutlined
                        onClick={() => handleCronJobStart(item)}
                      />
                    ),
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={formatDepToTemplate(
                      item.template!,
                      item.dependency
                    )}
                  />
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default AutoSpeak;
