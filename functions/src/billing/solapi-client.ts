// functions/src/billing/solapi-client.ts
import * as crypto from "crypto";
import { logger } from "firebase-functions/v2";

interface SendMessageParams {
  to: string;
  text: string;
  from: string;
  type?: "SMS" | "LMS" | "ATA"; // ATA = 알림톡
  kakaoOptions?: {
    pfId: string;
    templateId: string;
    variables: Record<string, string>;
  };
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class SolapiClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly baseUrl = "https://api.solapi.com";

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private generateSignature(): { authorization: string } {
    const date = new Date().toISOString();
    const salt = crypto.randomBytes(32).toString("hex");
    const signature = crypto
      .createHmac("sha256", this.apiSecret)
      .update(date + salt)
      .digest("hex");

    return {
      authorization: `HMAC-SHA256 apiKey=${this.apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
    };
  }

  async sendMessage(params: SendMessageParams): Promise<SendResult> {
    const { authorization } = this.generateSignature();

    const messageType =
      params.type ?? (params.text.length > 90 ? "LMS" : "SMS");

    const messagePayload: Record<string, unknown> = {
      to: params.to,
      from: params.from,
      text: params.text,
      type: messageType,
    };

    if (params.kakaoOptions) {
      messagePayload.kakaoOptions = params.kakaoOptions;
    }

    const body = { message: messagePayload };

    try {
      const response = await fetch(`${this.baseUrl}/messages/v4/send`, {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const errMsg =
          typeof data.errorMessage === "string"
            ? data.errorMessage
            : "발송 실패";
        logger.error("Solapi send failed", { status: response.status, data });
        return { success: false, error: errMsg };
      }

      const messageId =
        typeof data.groupId === "string" ? data.groupId : undefined;
      return { success: true, messageId };
    } catch (error) {
      logger.error("Solapi API error", { error: String(error) });
      return { success: false, error: String(error) };
    }
  }
}
