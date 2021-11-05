import { FG_TYPE_DATA_SOURCE } from "@/constants/feature-goods";
import { tabState } from "@/models/finance/feature-goods";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { memo, useMemo } from "react";
import { useRecoilState } from "recoil";

export default memo(() => {
  const [tab, setTab] = useRecoilState(tabState);

  const fgName = useMemo(() => {
    return (
      FG_TYPE_DATA_SOURCE.find(({ key }) => key === tab)?.name || "选择期货"
    );
  }, [tab]);

  return (
    <Dropdown
      overlay={
        <Menu
          onClick={(e) => {
            setTab(e.key);
          }}
        >
          {FG_TYPE_DATA_SOURCE.map(({ name, key }) => (
            <Menu.Item key={key}>{name}</Menu.Item>
          ))}
        </Menu>
      }
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        {fgName} <DownOutlined />
      </a>
    </Dropdown>
  );
});
