import { ipcObserver, uuid } from "@/utils";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, UploadProps } from "antd";
import { CSSProperties, useMemo, ReactNode } from "react";

interface LocalFileUploaderProps {
  onChange?: (paths: string[] | string) => void;
  listType?: UploadProps["listType"];
  value?: string[];
  multiple?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  accept?: string;
  className?: string;
  deleteCacheDuration?: number;
}

const LocalFileUploader = ({
  onChange,
  listType = "picture-card",
  value = [],
  multiple,
  style,
  children,
  accept,
  className,
  deleteCacheDuration = 0,
}: LocalFileUploaderProps) => {
  const fileList = useMemo(() => {
    return (Array.isArray(value) ? value : [value]).map((val: string) => ({
      url: val,
      status: "done",
      uid: val,
      name: val,
    }));
  }, [value]);

  const beforeUpload = (file: any) => {
    const storeKey = uuid();

    ipcObserver({
      type: "upload-file",
      extraMap: {
        name: file.name,
        path: file.path,
        storeKey,
      },
    }).subscribe((res) => {
      onChange?.(multiple ? [res as string] : res);

      if (deleteCacheDuration) {
        setTimeout(() => {
          ipcObserver({
            type: "file-delete",
            extraMap: {
              storeKey: multiple ? storeKey : [storeKey],
              isCache: true,
            },
          }).subscribe();
        }, deleteCacheDuration);
      }
    });
  };

  const onUploadChange = (file: any) => {
    onChange?.(
      (file?.fileList as Array<{ url: string }>).map(({ url }) => url)!
    );
  };

  return (
    <Upload.Dragger
      listType={listType}
      beforeUpload={beforeUpload}
      fileList={fileList as any}
      onChange={onUploadChange}
      style={style}
      accept={accept}
      className={className}
    >
      {children || <UploadOutlined />}
    </Upload.Dragger>
  );
};

export default LocalFileUploader;
