// functions/src/billing/popbill-client.ts
import { logger } from "firebase-functions/v2";

// popbill 패키지는 CommonJS 모듈이므로 require로 임포트
// eslint-disable-next-line @typescript-eslint/no-require-imports
const popbill = require("popbill");

interface IssuerInfo {
  corpNum: string;      // 사업자등록번호
  corpName: string;     // 상호
  ceoName: string;      // 대표자
  addr: string;         // 주소
  bizType: string;      // 업태
  bizClass: string;     // 종목
  contactName: string;  // 담당자명
  email: string;        // 담당자 이메일
}

interface ReceiverInfo {
  corpNum: string;      // 사업자등록번호
  corpName: string;     // 상호
  ceoName: string;      // 대표자
  addr: string;         // 주소
  bizType: string;      // 업태
  bizClass: string;     // 종목
  contactName: string;  // 담당자명
  email: string;        // 담당자 이메일
}

interface TaxInvoiceItem {
  serialNum: number;    // 일련번호 (1부터)
  purchaseDT: string;   // 거래일자 (YYYYMMDD)
  itemName: string;     // 품명
  spec: string;         // 규격
  qty: number;          // 수량
  unitCost: number;     // 단가
  supplyCost: number;   // 공급가액
  tax: number;          // 세액
  remark: string;       // 비고
}

export interface IssueTaxInvoiceParams {
  mgtKey: string;           // 관리번호 (고유, 예: invoiceId)
  writeDate: string;        // 작성일자 (YYYYMMDD)
  issuer: IssuerInfo;
  receiver: ReceiverInfo;
  supplyCostTotal: number;  // 공급가액 합계
  taxTotal: number;         // 세액 합계
  totalAmount: number;      // 합계금액
  remark1: string;          // 비고1
  items: TaxInvoiceItem[];
}

interface IssueTaxInvoiceResult {
  success: boolean;
  taxInvoiceId?: string;
  errorMessage?: string;
}

export class PopbillClient {
  private readonly linkId: string;
  private readonly secretKey: string;
  private readonly isTest: boolean;
  private taxinvoiceService: ReturnType<typeof popbill.TaxinvoiceService>;

  constructor(linkId: string, secretKey: string, isSandbox: boolean) {
    this.linkId = linkId;
    this.secretKey = secretKey;
    this.isTest = isSandbox;

    popbill.config({
      LinkID: this.linkId,
      SecretKey: this.secretKey,
      IsTest: this.isTest,
      defaultErrorHandler: (err: { code: number; message: string }) => {
        logger.error("Popbill default error handler", {
          code: err.code,
          message: err.message,
        });
      },
    });

    this.taxinvoiceService = popbill.TaxinvoiceService();
  }

  async registIssue(
    params: IssueTaxInvoiceParams
  ): Promise<IssueTaxInvoiceResult> {
    const taxinvoice = {
      writeDate: params.writeDate,
      chargeDirection: "정과금",
      issueType: "정발행",
      purposeType: "영수",
      issueTiming: "직접발행",
      taxType: "과세",

      // 공급자
      invoicerCorpNum: params.issuer.corpNum,
      invoicerMgtKey: params.mgtKey,
      invoicerTaxRegID: "",
      invoicerCorpName: params.issuer.corpName,
      invoicerCEOName: params.issuer.ceoName,
      invoicerAddr: params.issuer.addr,
      invoicerBizType: params.issuer.bizType,
      invoicerBizClass: params.issuer.bizClass,
      invoicerContactName: params.issuer.contactName,
      invoicerEmail: params.issuer.email,
      invoicerSMSSendYN: false,

      // 공급받는자
      invoiceeType: "사업자",
      invoiceeCorpNum: params.receiver.corpNum,
      invoiceeMgtKey: "",
      invoiceeTaxRegID: "",
      invoiceeCorpName: params.receiver.corpName,
      invoiceeCEOName: params.receiver.ceoName,
      invoiceeAddr: params.receiver.addr,
      invoiceeBizType: params.receiver.bizType,
      invoiceeBizClass: params.receiver.bizClass,
      invoiceeContactName1: params.receiver.contactName,
      invoiceeEmail1: params.receiver.email,
      invoiceeSMSSendYN: true,

      // 합계
      supplyCostTotal: String(params.supplyCostTotal),
      taxTotal: String(params.taxTotal),
      totalAmount: String(params.totalAmount),
      remark1: params.remark1,
      remark2: "",
      remark3: "",

      // 품목
      detailList: params.items.map((item) => ({
        serialNum: item.serialNum,
        purchaseDT: item.purchaseDT,
        itemName: item.itemName,
        spec: item.spec,
        qty: String(item.qty),
        unitCost: String(item.unitCost),
        supplyCost: String(item.supplyCost),
        tax: String(item.tax),
        remark: item.remark,
      })),
    };

    return new Promise((resolve) => {
      this.taxinvoiceService.registIssue(
        params.issuer.corpNum,
        taxinvoice,
        false,  // writeSpecification (별도 명세서 미발행)
        false,  // forceIssue
        "",     // memo
        "",     // emailSubject
        "",     // userID
        "",     // invoiceeEmailYN
        (response: { code: number; message: string; ntsConfirmNum?: string }) => {
          if (response.code === 1) {
            logger.info("Popbill tax invoice issued", {
              mgtKey: params.mgtKey,
              ntsConfirmNum: response.ntsConfirmNum,
            });
            resolve({
              success: true,
              taxInvoiceId: response.ntsConfirmNum ?? params.mgtKey,
            });
          } else {
            logger.error("Popbill registIssue failed", {
              code: response.code,
              message: response.message,
            });
            resolve({ success: false, errorMessage: response.message });
          }
        },
        (error: { code: number; message: string }) => {
          logger.error("Popbill registIssue error", {
            code: error.code,
            message: error.message,
          });
          resolve({ success: false, errorMessage: error.message });
        }
      );
    });
  }
}
