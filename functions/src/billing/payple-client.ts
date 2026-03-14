// functions/src/billing/payple-client.ts
// TODO: 페이플 가맹 후 실제 API 문서 확인 필요
import { logger } from "firebase-functions/v2";

interface PaypleAuthResponse {
  result: "success" | "error";
  cst_id: string;
  custKey: string;
  AuthKey: string;
  PCD_PAY_URL: string;
  errorMessage?: string;
}

interface PaypleAuthInfo {
  authKey: string;
  payUrl: string;
}

interface PaypleBillingPayParams {
  billingKey: string;
  amount: number;
  orderId: string;
  productName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
}

interface PayplePayResult {
  success: boolean;
  paymentId?: string;
  errorMessage?: string;
}

interface PayplePaymentStatusResult {
  success: boolean;
  status?: string;
  amount?: number;
  errorMessage?: string;
}

interface PaypleCmsRegisterParams {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  returnUrl: string;
}

interface PaypleCmsRegisterResult {
  success: boolean;
  authUrl?: string;
  errorMessage?: string;
}

export class PaypleClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;

  constructor(clientId: string, clientSecret: string, isSandbox: boolean) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = isSandbox
      ? "https://democpay.payple.kr"
      : "https://cpay.payple.kr";
  }

  private async getAuthInfo(): Promise<PaypleAuthInfo> {
    // TODO: 페이플 가맹 후 실제 API 문서 확인 필요
    const response = await fetch(`${this.baseUrl}/php/auth.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cst_id: this.clientId,
        custKey: this.clientSecret,
        PCD_PAY_TYPE: "transfer",
      }),
    });

    const data = (await response.json()) as PaypleAuthResponse;

    if (!response.ok || data.result !== "success") {
      const msg = data.errorMessage ?? "페이플 인증 실패";
      logger.error("Payple auth failed", { status: response.status, data });
      throw new Error(msg);
    }

    return { authKey: data.AuthKey, payUrl: data.PCD_PAY_URL };
  }

  async registerCmsBillingUrl(
    params: PaypleCmsRegisterParams
  ): Promise<PaypleCmsRegisterResult> {
    try {
      const { authKey, payUrl } = await this.getAuthInfo();

      // TODO: 페이플 가맹 후 실제 API 문서 확인 필요
      const response = await fetch(`${this.baseUrl}/php/cPayPaymentAct.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PCD_AUTH_KEY: authKey,
          PCD_PAY_URL: payUrl,
          PCD_PAY_TYPE: "transfer",
          PCD_PAY_WORK: "AUTH",
          PCD_PAYER_NAME: params.buyerName,
          PCD_PAYER_EMAIL: params.buyerEmail,
          PCD_PAYER_HP: params.buyerPhone,
          PCD_ORDER_KEY: params.orderId,
          PCD_RST_URL: params.returnUrl,
          PCD_REGULER_FLAG: "Y",
        }),
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const msg =
          typeof data.PCD_PAY_MSG === "string" ? data.PCD_PAY_MSG : "등록 실패";
        logger.error("Payple CMS register failed", {
          status: response.status,
          data,
        });
        return { success: false, errorMessage: msg };
      }

      const authUrl =
        typeof data.PCD_PAY_URL === "string" ? data.PCD_PAY_URL : undefined;
      return { success: true, authUrl };
    } catch (error) {
      logger.error("Payple registerCmsBillingUrl error", {
        error: String(error),
      });
      return { success: false, errorMessage: String(error) };
    }
  }

  async requestBillingPay(
    params: PaypleBillingPayParams
  ): Promise<PayplePayResult> {
    try {
      const { authKey, payUrl } = await this.getAuthInfo();

      // TODO: 페이플 가맹 후 실제 API 문서 확인 필요
      const response = await fetch(`${this.baseUrl}/php/PayCardAct.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PCD_AUTH_KEY: authKey,
          PCD_PAY_URL: payUrl,
          PCD_PAY_TYPE: "transfer",
          PCD_PAY_WORK: "PAY",
          PCD_BILLING_KEY: params.billingKey,
          PCD_PAY_GOODS: params.productName,
          PCD_PAY_TOTAL: params.amount,
          PCD_PAY_OID: params.orderId,
          PCD_PAYER_NAME: params.buyerName,
          PCD_PAYER_EMAIL: params.buyerEmail,
          PCD_PAYER_HP: params.buyerPhone,
          PCD_REGULER_FLAG: "Y",
          PCD_PAY_BANKACCTYPE: "Y",
        }),
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const msg =
          typeof data.PCD_PAY_MSG === "string" ? data.PCD_PAY_MSG : "결제 실패";
        logger.error("Payple billing pay failed", {
          status: response.status,
          data,
        });
        return { success: false, errorMessage: msg };
      }

      const rst =
        typeof data.PCD_PAY_RST === "string" ? data.PCD_PAY_RST : "";
      if (rst !== "success") {
        const msg =
          typeof data.PCD_PAY_MSG === "string"
            ? data.PCD_PAY_MSG
            : "결제 승인 실패";
        logger.warn("Payple billing pay not approved", { data });
        return { success: false, errorMessage: msg };
      }

      const paymentId =
        typeof data.PCD_PAY_OID === "string" ? data.PCD_PAY_OID : undefined;
      return { success: true, paymentId };
    } catch (error) {
      logger.error("Payple requestBillingPay error", { error: String(error) });
      return { success: false, errorMessage: String(error) };
    }
  }

  async getPaymentStatus(
    paymentId: string
  ): Promise<PayplePaymentStatusResult> {
    try {
      const { authKey, payUrl } = await this.getAuthInfo();

      // TODO: 페이플 가맹 후 실제 API 문서 확인 필요
      const response = await fetch(`${this.baseUrl}/php/PaymentStatusAct.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PCD_AUTH_KEY: authKey,
          PCD_PAY_URL: payUrl,
          PCD_PAY_OID: paymentId,
        }),
      });

      const data = (await response.json()) as Record<string, unknown>;

      if (!response.ok) {
        const msg =
          typeof data.PCD_PAY_MSG === "string"
            ? data.PCD_PAY_MSG
            : "조회 실패";
        logger.error("Payple getPaymentStatus failed", {
          status: response.status,
          data,
        });
        return { success: false, errorMessage: msg };
      }

      const status =
        typeof data.PCD_PAY_RST === "string" ? data.PCD_PAY_RST : undefined;
      const amount =
        typeof data.PCD_PAY_TOTAL === "number"
          ? data.PCD_PAY_TOTAL
          : undefined;
      return { success: true, status, amount };
    } catch (error) {
      logger.error("Payple getPaymentStatus error", { error: String(error) });
      return { success: false, errorMessage: String(error) };
    }
  }
}
