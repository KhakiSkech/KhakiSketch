import { onObjectFinalized } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import sharp from "sharp";

const SIZES = [
  { prefix: "thumbs", width: 300 },
  { prefix: "medium", width: 800 },
] as const;

/**
 * Storage onFinalize 트리거: 이미지 업로드 시 썸네일/중간 사이즈 자동 생성
 *
 * - images/ 경로의 이미지만 처리
 * - thumbs/, medium/ 경로는 건너뛰어 무한 루프 방지
 * - sharp로 WebP 변환 (quality 80)
 */
export const onImageUploaded = onObjectFinalized(
  {
    region: "us-west1",
    memory: "512MiB",
    timeoutSeconds: 120,
  },
  async (event) => {
    const object = event.data;
    const filePath = object.name;
    const contentType = object.contentType;

    // 이미지 파일만 처리
    if (!filePath || !contentType?.startsWith("image/")) return;

    // 생성된 썸네일은 건너뛰기 (무한 루프 방지)
    if (filePath.startsWith("thumbs/") || filePath.startsWith("medium/")) {
      return;
    }

    // images/ 경로의 파일만 처리
    if (!filePath.startsWith("images/")) return;

    const bucket = admin.storage().bucket(object.bucket);
    const fileName = path.basename(filePath);
    const fileNameNoExt = path.parse(fileName).name;
    // images/ 이후의 상대 경로 (하위 폴더 유지)
    const relativePath = path.dirname(filePath).replace(/^images\/?/, "");
    const tempFilePath = path.join(os.tmpdir(), `orig_${fileName}`);

    try {
      // 원본 다운로드
      await bucket.file(filePath).download({ destination: tempFilePath });

      for (const size of SIZES) {
        const outputFileName = `${fileNameNoExt}.webp`;
        const tempOutputPath = path.join(
          os.tmpdir(),
          `${size.prefix}_${outputFileName}`
        );

        // sharp로 리사이즈 + WebP 변환
        await sharp(tempFilePath)
          .resize(size.width, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(tempOutputPath);

        // 업로드 경로: thumbs/[relative]/filename.webp 또는 medium/[relative]/filename.webp
        const destination = relativePath
          ? `${size.prefix}/${relativePath}/${outputFileName}`
          : `${size.prefix}/${outputFileName}`;

        await bucket.upload(tempOutputPath, {
          destination,
          metadata: {
            contentType: "image/webp",
            metadata: {
              originalPath: filePath,
              generatedBy: "onImageUploaded",
            },
          },
        });

        // 임시 파일 정리
        fs.unlinkSync(tempOutputPath);
        logger.info(`Generated ${size.prefix}/${outputFileName} from ${filePath}`);
      }
    } catch (error) {
      logger.error(`Error processing image ${filePath}:`, error);
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
);
