/* eslint-disable jsx-a11y/alt-text */
import LocalFileUploader from "@/components/common/LocalFileUploader";
import {
  analysisState,
  analysisStatusState,
} from "@/models/game/menghuan/analysis";
import { UploadOutlined } from "@ant-design/icons";
import { Spin, message } from "antd";
import { useRecoilState } from "recoil";
import styles from "./index.module.scss";
import { useState } from "react";
import { useDbModel } from "@/models/game/menghuan/product";
import { searchImage } from "@/utils/image-similar";
import { maxBy } from "lodash";

const PackageUpload = () => {
  const [, setOriginImage] = useState("");
  const [, setDataSource] = useRecoilState(analysisState);
  const [status, setStatus] = useRecoilState(analysisStatusState);
  const { getAllProducts } = useDbModel();

  const onUploadChange = (image: string) => {
    setStatus("loading");
    setOriginImage(image);
    setDataSource([]);

    setTimeout(() => {
      const canvas = document.createElement("canvas");

      canvas.width = 500;
      canvas.height = 500;

      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = image;

      img.onload = async () => {
        ctx?.drawImage(img, 0, 0, 500, 400);

        const arr = [];
        const allProduct: game_mh_product.Product[] = getAllProducts();

        var q = 1;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 5; j++) {
            var data = ctx?.getImageData(j * 100, i * 100, 500, 400);
            const purImg = document.createElement("canvas");

            purImg.width = 100;
            purImg.height = 100;

            const purCtx = purImg.getContext("2d");

            purCtx?.putImageData(data!, 0, 0);
            const imgStr = purImg.toDataURL(q + ".png");

            const productSimilar = [];

            for (const {
              coverImage,
              similarCoverImages,
              ...others
            } of allProduct) {
              productSimilar.push({
                similarity: await searchImage(imgStr, coverImage, 100, 100),
                product: {
                  coverImage,
                  similarCoverImages,
                  ...others,
                },
              });

              for (const imgUrl of similarCoverImages || []) {
                productSimilar.push({
                  similarity: await searchImage(imgStr, imgUrl, 100, 100),
                  product: {
                    coverImage,
                    similarCoverImages,
                    ...others,
                  },
                });
              }
            }

            let mostSimilar = maxBy(productSimilar, "similarity");

            if (mostSimilar?.similarity! < 80) {
              mostSimilar = undefined;
            }

            arr.push({
              url: imgStr,
              price: mostSimilar ? Number(mostSimilar.product.price) : 0,
              name: mostSimilar ? mostSimilar.product.name! : "未识别物品",
              disabled: false,
            });

            q++;
          }
        }

        setDataSource(arr);

        setStatus("success");

        message.success("背包分析成功");
      };
    }, 1000);
  };

  return (
    <Spin spinning={status === "loading"}>
      <LocalFileUploader
        onChange={(res) => onUploadChange(res as string)}
        accept="image/*"
        className={styles.uploader}
        deleteCacheDuration={2000}
      >
        <UploadOutlined className={styles.uploadTxt} />
        <span className={styles.uploadTxt}>上传背包图片</span>
      </LocalFileUploader>
    </Spin>
  );
};

export default PackageUpload;
