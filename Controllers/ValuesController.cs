using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using System.IO;
using SERVIF;

namespace GSBWEB.Controllers
{
    [Authorize]
    public class ValuesController : ApiController
    {
        [HttpGet]
        public IHttpActionResult deleteHeadColWqs([FromUri] decimal HEAD_COL_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            a.deleteHeadColWqs(HEAD_COL_RUNNING_ID);

            return Json(new { });
        }
        [HttpGet]
        public IHttpActionResult getWqsFactorList([FromUri]decimal HEAD_COL_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getWqsFactorList2(HEAD_COL_RUNNING_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult createReviewJob([FromUri] decimal REQUEST_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.createReviewJob(REQUEST_RUNNING_ID, this.getLogonUser());

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getRequestFormByNo([FromUri] string REQUEST_NO)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.getRequestFormByNo(REQUEST_NO, this.getLogonUser());

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getHeadColById([FromUri] decimal DOC_ID, [FromUri] decimal HEAD_COL_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.getHeadColById(DOC_ID, HEAD_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getPhotoTakenPoint()
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getPhotoTakenPoint();

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getHeadColPhoto([FromUri] decimal HEAD_COL_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getHeadColPhoto(HEAD_COL_RUNNING_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getRequestAttachForApprover([FromUri] decimal DOC_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getRequestAttach(DOC_ID, true);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult genAppraisalReport([FromBody] MODEL.AAG_ATTACHDOCc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.genAppraisalReport(data, this.getLogonUser());

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getHeadColAppraisalList([FromUri] decimal JOB_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getHeadColAppraisal(JOB_RUNNING_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getHeadColAppraisalModel([FromUri] decimal JOB_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.getHeadColAppraisalModel(JOB_RUNNING_ID, HEAD_COL_RUNNING_ID);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult setHeadColAppraisalModel([FromBody] MODEL.APPRAISAL_HEAD_COL data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setHeadColAppraisalModel(data, this.getLogonUser());

            return Json(result);
        }

        //[HttpGet]
        //public IHttpActionResult getAppraisalMethod([FromUri] decimal JOB_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID)
        //{
        //    SERVIF.APPRAISAL a = new APPRAISAL();

        //    var results = a.getAppraisalMethod(JOB_RUNNING_ID, HEAD_COL_RUNNING_ID);

        //    return Json(results);
        //}

        [HttpGet]
        public IHttpActionResult getLenders([FromUri] decimal REQUEST_RUNNING_ID, [FromUri] string LENDER_TYPE)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getLenders(REQUEST_RUNNING_ID, LENDER_TYPE);

            return Json(results);
        }

        [HttpGet]
        public IHttpActionResult getLender([FromUri] decimal LENDER_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.getLender(LENDER_RUNNING_ID);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult setLender([FromBody] MODEL.AAG_LENDERc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setLender(data, this.getLogonUser(), false);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult delLender([FromBody] MODEL.AAG_LENDERc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setLender(data, this.getLogonUser(), true);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult delParameter([FromBody] MODEL.AAG_M_PARAMETERc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setParameter(data, this.getLogonUser(), true);

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult setParameter([FromBody] MODEL.AAG_M_PARAMETERc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setParameter(data, this.getLogonUser());

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getParameter([FromUri] decimal P_RUNNING_ID, [FromUri] string CODE_MAJOR, [FromUri] string FILTER)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getParameter(P_RUNNING_ID, CODE_MAJOR, FILTER);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult changeUserValue([FromUri] MODEL.AAG_M_USERc data)
        {
            SERVIF.USER u = new USER();

            var result = u.changeUserValue(data, this.getLogonUser());

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getOU()
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getOU();

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getPrefix([FromUri] string FILTER)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getPrefix(FILTER);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getMasterUser([FromUri] decimal USER_RUNNING_ID, [FromUri] string FILTER)
        {
            SERVIF.USER u = new USER();

            var results = u.getMasterUser(USER_RUNNING_ID, FILTER);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setMasterUser([FromBody] MODEL.AAG_M_USERc data)
        {
            SERVIF.USER u = new USER();

            var result = u.setMasterUser(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult setMasterOrgRoles([FromBody] List<MODEL.ORGROLES> data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setMasterOrgRoles(data, this.getLogonUser());

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getMasterOrgRoles([FromUri] decimal OU_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.getMasterOrgRoles(OU_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getCustContact([FromUri] decimal JOB_RUNNING_ID, [FromUri] decimal CUSCONTACT_RUNNING_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.getCustContact(JOB_RUNNING_ID, CUSCONTACT_RUNNING_ID, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult setCustContact([FromBody] MODEL.AAG_CUSCONTACTc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setCustContact(data, this.getLogonUser(), false);

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult delCustContact([FromBody] MODEL.AAG_CUSCONTACTc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var result = a.setCustContact(data, this.getLogonUser(), true);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getContactResult()
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getContactResult();

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getInsuredCode()
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getInsuredCode();

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getDeedOffice()
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getDeedOffice();

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getCustRelation(string FILTER = "")
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getCustRelation(FILTER);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getAcquireVia(string FILTER = "")
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getAcquireVia(FILTER);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getDocActHist([FromUri] decimal ACT_HIST_ID, [FromUri] string H)
        {
            SERVIF.W4 w4 = new W4();

            var result = w4.getDocActHist(ACT_HIST_ID, H);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getDocStateV2([FromUri] decimal ACT_HIST_ID, [FromUri] decimal ROLE_ID, [FromUri] string H)
        {
            SERVIF.W4 w4 = new W4();

            var result = w4.getDocStateV2(ACT_HIST_ID, ROLE_ID, H, this.getLogonUser());

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getAllOU([FromUri] string FILTER)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getAllOU(FILTER);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getOURoles([FromUri] decimal OU_ID)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.getOURoles(OU_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286003([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_LAND()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID,
                PROJECT_PRICE = new MODEL.AAG_PROJECT_PRICEc()
                {
                    JOB_RUNNING_ID = JOB_RUNNING_ID,
                    UNIT_TYPE = a.getProjectUnit(HEAD_COL_RUNNING_ID)
                }
            } : a.getSubCol_286003(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286004([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();
            
            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_BUILDING()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID,
                PROJECT_PRICE = new MODEL.AAG_PROJECT_PRICEc()
                {
                    JOB_RUNNING_ID = JOB_RUNNING_ID,
                    UNIT_TYPE = a.getProjectUnit(HEAD_COL_RUNNING_ID)
                }
            } : a.getSubCol_286004(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            if (SUB_COL_RUNNING_ID == 0)
            {
                result.BUILDING_FLOOR.Add(new MODEL.AAG_COL_BUILDING_FLOORc()
                {
                    ORDER_LIST = 1,
                    DSC_FLOORNAME = "ชั้น 1"
                });

                result.BUILDING_FLOOR.Add(new MODEL.AAG_COL_BUILDING_FLOORc()
                {
                    ORDER_LIST = 2,
                    DSC_FLOORNAME = "ชั้น 2"
                });

                result.BUILDING_FLOOR.Add(new MODEL.AAG_COL_BUILDING_FLOORc()
                {
                    ORDER_LIST = 3,
                    DSC_FLOORNAME = "ชั้น 3"
                });
            }

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286005([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_RENTc()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID
            } : a.getSubCol_286005(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286066([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_CONDOc()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID,
                PROJECT_PRICE = new MODEL.AAG_PROJECT_PRICEc()
                {
                    JOB_RUNNING_ID = JOB_RUNNING_ID,
                    UNIT_TYPE = a.getProjectUnit(HEAD_COL_RUNNING_ID)
                }
            } : a.getSubCol_286066(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286011([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_MACHINEc()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID
            } : a.getSubCol_286011(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286038([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_CARc()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID
            } : a.getSubCol_286038(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_286039([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_SHIPc()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID
            } : a.getSubCol_286039(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getSubCol_999999([FromUri] decimal SUB_COL_RUNNING_ID, [FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = SUB_COL_RUNNING_ID == 0 ? new MODEL.AAG_COL_OTHERSc()
            {
                HEAD_COL_RUNNING_ID = HEAD_COL_RUNNING_ID,
                JOB_RUNNING_ID = JOB_RUNNING_ID
            } : a.getSubCol_999999(HEAD_COL_RUNNING_ID, SUB_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteColCus([FromBody] MODEL.AAG_COL_CUSc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.deleteColCus(data, this.getLogonUser());

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult httpRequest([FromUri]string url)
        {
            APPRAISAL a = new APPRAISAL();

            string result = a.httpRequest(url);

            return Json(new { result = result });
        }

        [HttpGet]
        public IHttpActionResult testCrystalReport([FromUri] string file)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.testCrystalReport(file);

            return Json(new { file = result });
        }
        [HttpGet]
        public IHttpActionResult getRptFiles()
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getRptFiles();

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult splitSubCol_286003([FromBody] MODEL.AAG_COL_LAND data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.splitSubCol_286003(data, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult splitSubCol_286004([FromBody] MODEL.AAG_COL_BUILDING data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.splitSubCol_286004(data, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult splitSubCol_286011([FromBody] MODEL.AAG_COL_MACHINEc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.splitSubCol_286011(data, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult splitSubCol_286066([FromBody] MODEL.AAG_COL_CONDOc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.splitSubCol_286066(data, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult approverSaveSend([FromBody] MODEL.REQUEST_FORM data)
        {
            APPRAISAL a = new APPRAISAL();

            a.approverSaveData(data, this.getLogonUser(), true);

            return Json(new { });
        }
        [HttpPost]
        public IHttpActionResult approverSave([FromBody] MODEL.REQUEST_FORM data)
        {
            APPRAISAL a = new APPRAISAL();

            a.approverSaveData(data, this.getLogonUser(), false);

            return Json(new { });
        }
        [HttpGet]
        public IHttpActionResult genRequestCommittee([FromUri] decimal JOB_RUNNING_ID, [FromUri] decimal DOC_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.genRequestCommittee(JOB_RUNNING_ID, DOC_ID, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteCalendar([FromBody] MODEL.AAG_CALENDARc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setCalendar(data, this.getLogonUser(), true);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setCalendar([FromBody] MODEL.AAG_CALENDARc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setCalendar(data, this.getLogonUser());

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getCalendar([FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getCalendar(JOB_RUNNING_ID, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setCOLL_ID([FromBody] List<MODEL.AAG_HEAD_COL> data)
        {
            APPRAISAL a = new APPRAISAL();

            a.setCOLL_ID(data, this.getLogonUser());

            return Json(new { });
        }
        [HttpGet]
        public IHttpActionResult getCOLL_ID([FromUri] decimal JOB_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getCOLL_ID(JOB_RUNNING_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getQnrResult([FromUri] decimal QNR_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getQnrResult(QNR_ID);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setQuestionnaire([FromBody] MODEL.QUESTIONNAIRE data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setQuestionnaire(data, this.getLogonUser());

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getQuestionnaire([FromUri] decimal QNR_ID, [FromUri] decimal RESULT_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getQuestionnaire(QNR_ID, RESULT_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getQnrPackage()
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getQnrPackage();

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setQnrAnswer([FromBody] MODEL.QNR_MASTERc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setQnrAnswer(data, this.getLogonUser());

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getQnrMaster([FromUri] decimal QNR_ID, [FromUri] decimal RESULT_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getQnrMaster(QNR_ID, RESULT_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getCost([FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] decimal BUILDING_COL_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getCost(HEAD_COL_RUNNING_ID, BUILDING_COL_RUNNING_ID);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setCost([FromBody] List<MODEL.AAG_COSTAPPROACHBUILDINGc> data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setCost(data, this.getLogonUser(), false);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getWqs([FromUri] decimal HEAD_COL_RUNNING_ID, [FromUri] string HEAD_COL_TYPE_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getWQS(HEAD_COL_RUNNING_ID, HEAD_COL_TYPE_ID);

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult setMarketCompairNumber([FromBody] MODEL.AAG_HEAD_COL data)
        {
            APPRAISAL a = new APPRAISAL();

            a.setMarketCompairNumber(data, this.getLogonUser());

            return Json(new { });
        }
        [HttpGet]
        public IHttpActionResult getMarketTemplateType()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMarketTemplateType();

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getMarketType()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMarketType();

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult setJobMarketPrice([FromBody] MODEL.AAG_JOBMARKETPRICEc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setJobMarketPrice(data, this.getLogonUser(), false);

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteJobMarketPrice([FromBody] MODEL.AAG_JOBMARKETPRICEc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setJobMarketPrice(data, this.getLogonUser(), true);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getJobMarketPrice([FromUri] decimal HEAD_COL_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getJobMarketPrice(HEAD_COL_RUNNING_ID);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getHeadColType()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getHeadColType("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getHeadColSubType([FromUri] string MAIN_CODE)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getHeadColSubType(MAIN_CODE);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getColCertType()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getColCertType("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getColUsage()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getColUsage("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getPropEvironment()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getPropEvironment("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getPropShape()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getPropShape("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getInteriorLevel()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getInteriorLevel("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getMaintainLevel()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMaintainLevel("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getLandColor()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getLandColor("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getMarketSell()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMarketSell("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getMarketStatus()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMarketStatus("");

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getMarketInfo()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMarketInfo("");

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult deleteMarketPrice([FromBody] MODEL.AAG_M_PRICEMARKETSTOCKc data)
        {
            APPRAISAL a = new APPRAISAL();

            int totals = 0;

            var result = a.setMarketPrice(data, this.getLogonUser(), true);

            return Json(new { data = result, totals = totals });
        }
        [HttpPost]
        public IHttpActionResult setMarketPrice([FromBody] MODEL.AAG_M_PRICEMARKETSTOCKc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setMarketPrice(data, this.getLogonUser(), false);

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult getMarketPrice([FromBody] MODEL.PAGING paging)
        {
            APPRAISAL a = new APPRAISAL();

            int totals = 0;

            var result = a.getMarketPrice(paging, out totals);

            return Json(new { data = result, totals = totals });
        }
        [HttpPost]
        public IHttpActionResult createColleteralFromProject([FromBody] MODEL.AAG_PROJECT_UNIT_TYPEc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.createColleteralFromProject(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult setProvince([FromBody] MODEL.PROVINCE data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setProvince(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteProvince([FromBody] MODEL.PROVINCE data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setProvince(data, this.getLogonUser(), true);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult setDistrict([FromBody] MODEL.DISTRICT data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setDistrict(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteDistrict([FromBody] MODEL.DISTRICT data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setDistrict(data, this.getLogonUser(), true);

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult setSubDistrict([FromBody] MODEL.SUBDISTRICT data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubDistrict(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubDistrict([FromBody] MODEL.SUBDISTRICT data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubDistrict(data, this.getLogonUser(), true);

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getCompletedProjectUnit([FromUri] decimal PROJECT_RUNNING_ID, [FromUri] string FILTER)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getCompletedProjectUnit(PROJECT_RUNNING_ID, FILTER);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getCompletedProject([FromUri] string FILTER)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getCompletedProject(FILTER);

            return Json(results);
        }

        [HttpGet]
        public IHttpActionResult getUnitType()
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getUnitType();

            return Json(results);
        }

        #region PROJECT
        [HttpGet]
        public IHttpActionResult getDeveloper([FromUri] string FILTER)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getDeveloper(FILTER);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setDeveloper([FromBody] MODEL.AAG_M_DEVELOPERc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setDeveloper(new List<MODEL.AAG_M_DEVELOPERc>() { data }, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteDeveloper([FromBody] MODEL.AAG_M_DEVELOPERc data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setDeveloper(new List<MODEL.AAG_M_DEVELOPERc>() { data }, this.getLogonUser(), true);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getProject([FromUri] decimal DEV_RUNNING_ID, [FromUri] string FILTER)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getProject(DEV_RUNNING_ID, FILTER);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getProjectPhase([FromUri] decimal PROJECT_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getProjectPhase(PROJECT_RUNNING_ID);

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult getProjectPrice([FromUri] decimal PROJECT_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getProjectPrice(PROJECT_RUNNING_ID);

            return Json(results);
        }
        //[HttpGet]
        //public IHttpActionResult getProjectUnit([FromUri] decimal PROJECT_RUNNING_ID)
        //{
        //    APPRAISAL a = new APPRAISAL();

        //    var results = a.getProjectUnit(PROJECT_RUNNING_ID);

        //    return Json(results);
        //}
        [HttpGet]
        public IHttpActionResult getZoneByPhase([FromUri] decimal PROJECT_PHASE_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getZoneByPhase(PROJECT_PHASE_RUNNING_ID);

            return Json(results);
        }

        [HttpGet]
        public IHttpActionResult getZoneByProject([FromUri] decimal PROJECT_RUNNING_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getZoneByProject(PROJECT_RUNNING_ID);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult setProject([FromBody] MODEL.AAG_M_PROJECTc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProject(new List<MODEL.AAG_M_PROJECTc>() { data }, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteProject([FromBody] MODEL.AAG_M_PROJECTc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProject(new List<MODEL.AAG_M_PROJECTc>() { data }, this.getLogonUser(), true);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setProjectPhase([FromBody] MODEL.AAG_PROJECT_PHASEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectPhase(new List<MODEL.AAG_PROJECT_PHASEc>() { data }, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteProjectPhase([FromBody] MODEL.AAG_PROJECT_PHASEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectPhase(new List<MODEL.AAG_PROJECT_PHASEc>() { data }, this.getLogonUser(), true);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setProjectPrice([FromBody] MODEL.AAG_PROJECT_PRICEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectPrice(new List<MODEL.AAG_PROJECT_PRICEc>() { data }, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteProjectPrice([FromBody] MODEL.AAG_PROJECT_PRICEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectPrice(new List<MODEL.AAG_PROJECT_PRICEc>() { data }, this.getLogonUser(), true);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setProjectUnit([FromBody] MODEL.AAG_PROJECT_UNIT_TYPEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectUnit(new List<MODEL.AAG_PROJECT_UNIT_TYPEc>() { data }, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteProjectUnit([FromBody] MODEL.AAG_PROJECT_UNIT_TYPEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectUnit(new List<MODEL.AAG_PROJECT_UNIT_TYPEc>() { data }, this.getLogonUser(), true);

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult setProjectZone([FromBody] MODEL.AAG_PROJECT_ZONEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectZone(new List<MODEL.AAG_PROJECT_ZONEc>() { data }, this.getLogonUser());

            return Json(results);
        }
        [HttpPost]
        public IHttpActionResult deleteProjectZone([FromBody] MODEL.AAG_PROJECT_ZONEc data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setProjectZone(new List<MODEL.AAG_PROJECT_ZONEc>() { data }, this.getLogonUser(), true);

            return Json(results);
        }
        #endregion

        [HttpPost]
        public IHttpActionResult setWqs([FromBody] MODEL.WQS data)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.setWqs(data, this.getLogonUser());

            return Json(results);
        }

        //[HttpPost]
        //public IHttpActionResult setGrade([FromBody] List<MODEL.QUESTIONNAIRE> data)
        //{
        //    SERVIF.APPRAISAL a = new APPRAISAL();

        //    var results = a.setGrade(data, this.getLogonUser());

        //    return Json(results);
        //}

        [HttpPost]
        public IHttpActionResult genHeadCollReport([FromBody] MODEL.AAG_ATTACHDOCc attach)
        {
            SERVIF.APPRAISAL a = new APPRAISAL();

            var results = a.genHeadCollReport(attach, this.getLogonUser());

            return Json(results);
        }

        [HttpGet]
        public IHttpActionResult getRequestAttach([FromUri] decimal DOC_ID)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.getRequestAttach(DOC_ID);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult setRequestAttach([FromBody] List<MODEL.HEAD_COL_ATTACH> data)
        {
            APPRAISAL a = new APPRAISAL();

            var results = a.setRequestAttach(data, this.getLogonUser(), false);

            return Json(results);
        }

        [HttpPost]
        public IHttpActionResult deleteAttachDoc([FromBody] MODEL.AAG_ATTACHDOCc data)
        {
            APPRAISAL a = new APPRAISAL();

            a.deleteAttachDoc(data, this.getLogonUser());

            return Json(new { });
        }

        [HttpPost]
        public IHttpActionResult setColAttach([FromBody] List<MODEL.HEAD_COL_ATTACH> data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setColAttach(data, this.getLogonUser());

            return Json(result);
        }

        [HttpPost]
        public IHttpActionResult setColPhoto([FromBody] List<MODEL.COL_PHOTO_PAGE> data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setColPhoto(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteColPhotoPage([FromBody] List<MODEL.COL_PHOTO_PAGE> data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setColPhoto(data, this.getLogonUser(), true);

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getBrand()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getBrand();

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getMaterialFloor()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getMaterialFloor();

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getLandScape()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getLandScape();

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getRoadType()
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.getRoadType();

            return Json(result);
        }

        /// <summary>
        /// อื่นๆ
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_999999([FromBody] MODEL.AAG_COL_OTHERSc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_999999(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_999999([FromBody] MODEL.AAG_COL_OTHERSc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_999999(data, this.getLogonUser(), true);

            return Json(result);
        }

        /// <summary>
        /// คอนโด
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_300001([FromBody] MODEL.AAG_COL_CONDOc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_300001(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_300001([FromBody] MODEL.AAG_COL_CONDOc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_300001(data, this.getLogonUser(), true);

            return Json(result);
        }

        /// <summary>
        /// ที่ดินเปล่า
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_286003([FromBody] MODEL.AAG_COL_LAND data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286003(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_286003([FromBody] MODEL.AAG_COL_LAND data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286003(data, this.getLogonUser(), true);

            return Json(result);
        }
        /// <summary>
        /// อาคารสิ่งปลูกสร้าง
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_286004([FromBody] MODEL.AAG_COL_BUILDING data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286004(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_286004([FromBody] MODEL.AAG_COL_BUILDING data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286004(data, this.getLogonUser(), true);

            return Json(result);
        }

        /// <summary>
        /// รถยนต์
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_286038([FromBody] MODEL.AAG_COL_CARc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286038(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_286038([FromBody] MODEL.AAG_COL_CARc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286038(data, this.getLogonUser(), true);

            return Json(result);
        }

        /// <summary>
        /// เรือ
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_286039([FromBody] MODEL.AAG_COL_SHIPc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286039(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_286039([FromBody] MODEL.AAG_COL_SHIPc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286039(data, this.getLogonUser(), true);

            return Json(result);
        }

        /// <summary>
        /// สิทธิการเช่าอาคาร
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_286005([FromBody] MODEL.AAG_COL_RENTc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286005(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_286005([FromBody] MODEL.AAG_COL_RENTc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286005(data, this.getLogonUser(), true);

            return Json(result);
        }

        /// <summary>
        /// เครื่องจักร
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult setSubCol_286011([FromBody] MODEL.AAG_COL_MACHINEc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286011(data, this.getLogonUser());

            return Json(result);
        }
        [HttpPost]
        public IHttpActionResult deleteSubCol_286011([FromBody] MODEL.AAG_COL_MACHINEc data)
        {
            APPRAISAL a = new APPRAISAL();

            var result = a.setSubCol_286011(data, this.getLogonUser(), true);

            return Json(result);
        }
        [HttpGet]
        public IHttpActionResult getRISKCDE()
        {
            APPRAISAL a = new APPRAISAL();

            var list = a.getRISKCDE();

            return Json(list);
        }

        [HttpGet]
        public IHttpActionResult getColleteralUsageType()
        {
            APPRAISAL a = new APPRAISAL();

            var list = a.getColleteralUsage();

            return Json(list);
        }

        [HttpGet]
        public IHttpActionResult getEnergyType()
        {
            APPRAISAL a = new APPRAISAL();

            var list = a.getEnergyType();

            return Json(list);
        }

        [HttpGet]
        public IHttpActionResult getRoles()
        {
            W4 w4 = new W4();

            var list = w4.getRoles(this.getLogonUser());

            return Json(list);
        }

        [HttpGet]
        [AllowAnonymous]
        public IHttpActionResult getAllUser()
        {
            USER user = new USER();

            var list = user.getUsers("");

            return Json(new { data = list, total = list.Count });
        }

        [HttpPost]
        public IHttpActionResult getMyDocs(MODEL.PAGING paging)
        {
            W4 w4 = new W4();

            int total = 0;

            var list = w4.getMyDocs(paging, this.getLogonUser(), out total);

            return Json(new { data = list, total = total });
        }

        [HttpPost]
        public IHttpActionResult getMyInbox(MODEL.PAGING paging)
        {
            W4 w4 = new W4();

            int total = 0;

            var list = w4.getMyInbox(paging, this.getLogonUser(), out total);

            return Json(new { data = list, total = total });
        }

        [HttpPost]
        public IHttpActionResult getMyHist(MODEL.PAGING paging)
        {
            W4 w4 = new W4();

            int total = 0;

            var list = w4.getMyHist(paging, this.getLogonUser(), out total);

            return Json(new { data = list, total = total });
        }

        [HttpPost]
        public IHttpActionResult getUser()
        {
            return Json(this.getLogonUser());
        }

        [HttpPost]
        public IHttpActionResult getSytemInfo()
        {
            W4 w4 = new W4();

            return Json(w4.getSystemInfo());
        }


        [HttpGet]
        public IHttpActionResult getAppConfig()
        {
            W4 w4 = new W4();

            return Json(new
            {
                mapUrl = System.Configuration.ConfigurationManager.AppSettings["MAP_URL"],
                maxUploadFileSize = 50
            });
        }

        [HttpGet]
        public IHttpActionResult getCountry()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var list = app.getCountry();

                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getSubDistrict([FromUri] string PROVINCE_ID, [FromUri] string DISTRICT_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var list = app.getSubDistrict(PROVINCE_ID, DISTRICT_ID, "", true);

                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getSubDistrictMaster([FromUri] string PROVINCE_ID, [FromUri] string DISTRICT_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var list = app.getSubDistrict(PROVINCE_ID, DISTRICT_ID, "", false);

                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getDistrict([FromUri] string PROVINCE_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var list = app.getDistrict(PROVINCE_ID, "", true, "");

                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getDistrictMaster([FromBody] MODEL.PAGING paging)
        {
            try
            {
                int totals = 0;

                APPRAISAL app = new APPRAISAL();

                var list = app.getDistrictMaster(paging, out totals);

                return Json(new { data = list, totals = totals });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getProvince()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var list = app.getProvince("", "", true);

                return Json(list);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public IHttpActionResult getProvinceMaster([FromBody] MODEL.PAGING paging)
        {
            try
            {
                int totals = 0;

                APPRAISAL app = new APPRAISAL();

                var list = app.getProvinceMaster(paging, out totals);

                return Json(new { data = list, totals = totals });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //[HttpPost]
        //public IHttpActionResult getMatrix()
        //{
        //    try
        //    {
        //        List<MODEL.MATRIX> list = new List<MODEL.MATRIX>();

        //        for (int i = 0; i < 5; i++)
        //        {
        //            var matrix = new List<MODEL.MATRIX>();

        //            for (int j = 0; j < 10; j++)
        //            {
        //                matrix.Add(new MODEL.MATRIX() { CODE = string.Format("{0}:{1}", i, j), NAME = string.Format("{0}:{1}", i, j) });
        //            }

        //            list.Add(new MODEL.MATRIX()
        //            {
        //                CODE = string.Format("{0}", i),
        //                NAME = string.Format("{0}", i),
        //                LIST = matrix
        //            });
        //        }

        //        var results = list;

        //        return Json(new { success = true, data = results });
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        [HttpGet]
        public IHttpActionResult getStepOwner([FromUri] decimal DOC_ID, [FromUri] decimal STEP_ID)
        {
            try
            {
                W4 w4 = new W4();

                var results = w4.getStepOwner(DOC_ID, STEP_ID);

                return Json(new { success = true, data = results });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public IHttpActionResult countInboxAndHistory([FromUri] string ROLE_ID)
        {
            try
            {
                W4 w4 = new W4();

                var results = w4.countInboxAndHistory(ROLE_ID, this.getLogonUser());

                return Json(new { success = true, data = results });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //[HttpGet]
        //public IHttpActionResult getDocStateV2([FromUri] string ACT_HIST_ID)
        //{
        //    try
        //    {
        //        W4 w4 = new W4();

        //        var results = w4.getDocStateV2(Convert.ToDecimal(ACT_HIST_ID), this.getLogonUser());

        //        return Json(results);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        [HttpGet]
        public IHttpActionResult delHeadCol([FromUri] decimal HEAD_COL_RUNNING_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.delHeadCol(HEAD_COL_RUNNING_ID);

                return Json(new { success = true, data = results });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getHeadColl([FromUri] decimal DOC_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getHeadCol(DOC_ID);

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult setHeadColl([FromBody] MODEL.AAG_HEAD_COL data)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var result = app.setHeadCol(data, this.getLogonUser());

                return Json(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getDocState(decimal DOC_ID)
        {
            try
            {
                W4 w4 = new W4();

                var result = w4.getDocState(DOC_ID, this.getLogonUser());

                return Json(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getStateAction([FromUri] decimal DOC_ID)
        {
            try
            {
                W4 w4 = new W4();

                var results = w4.getStateAction(DOC_ID, this.getLogonUser());

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        [HttpGet]
        public IHttpActionResult getFormSection([FromUri] string DOC_ID)
        {
            try
            {
                List<MODEL.SECTION> sections = new List<MODEL.SECTION>();

                sections.Add(new MODEL.SECTION() { id = 100, code = "0100", title = "ข้อมูลใบคำขอ" });
                sections.Add(new MODEL.SECTION() { id = 200, code = "0200", title = "บันทึกขอมูลหลักทรัพย์" });
                sections.Add(new MODEL.SECTION() { id = 300, code = "0300", title = "แนบไฟล์เอกสาร" });
                sections.Add(new MODEL.SECTION() { id = 400, code = "0400", title = "หน่วยงานผู้จ่ายงาน" });
                sections.Add(new MODEL.SECTION() { id = 500, code = "0500", title = "จ่ายงานประเมิน" });
                sections.Add(new MODEL.SECTION() { id = 550, code = "0550", title = "นัดหมายลูกค้า" });
                sections.Add(new MODEL.SECTION() { id = 600, code = "0600", title = "จัดเกรดหลักทรัพย์" });
                sections.Add(new MODEL.SECTION() { id = 700, code = "0700", title = "จัดทำภาพถ่าย/แผนที่" });
                sections.Add(new MODEL.SECTION() { id = 800, code = "0800", title = "จัดทำข้อมูลตลาด" });
                sections.Add(new MODEL.SECTION() { id = 900, code = "0900", title = "จัดทำข้อมูล WQS" });
                sections.Add(new MODEL.SECTION() { id = 1000, code = "1000", title = "ราคาประเมินหลักทรัพย์" });
                sections.Add(new MODEL.SECTION() { id = 1100, code = "1100", title = "จัดทำเล่มรายงาน" });
                sections.Add(new MODEL.SECTION() { id = 1200, code = "1200", title = "ตรวจสอบเล่มและความถูกต้องของการประเมิน" });
                sections.Add(new MODEL.SECTION() { id = 1300, code = "1300", title = "พิมพ์แบบฟอร์มเอกสารสรุปผล" });
                sections.Add(new MODEL.SECTION() { id = 1400, code = "1400", title = "บันทึกผลสรุปและปิดงาน" });
                sections.Add(new MODEL.SECTION() { id = 1500, code = "1500", title = "ข้อมูลหลักทรัพย์ (COLL_ID)" });
                sections.Add(new MODEL.SECTION() { id = 1600, code = "1600", title = "ความพึงพอใจ" });
                sections.Add(new MODEL.SECTION() { id = 9500, code = "9500", title = "ประวัติสถานะ" });

                W4 w4 = new W4();

                var results = w4.getStateSections(Convert.ToDecimal(DOC_ID), this.getLogonUser());

                var results2 = from t1 in results
                               join t2 in sections
                               on t1.id equals t2.id into t2j
                               from t2 in t2j.DefaultIfEmpty()
                               select new MODEL.SECTION()
                               {
                                   id = t1.id,
                                   code = t2 == null ? "" : t2.code,
                                   title = t1.title,
                                   template = t2 == null ? "" : t2.template,
                                   create = t1.create,
                                   read = t1.read,
                                   update = t1.update,
                                   delete = t1.delete,
                                   active = t1.active,
                                   DOC_ID = Convert.ToDecimal(DOC_ID)
                               };

                return Json(results2.ToList());
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult w4changeState(decimal DOC_ID, decimal STATE_ID)
        {
            try
            {
                W4 w4 = new W4();

                w4.w4ChangeState(DOC_ID, STATE_ID);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public IHttpActionResult getRequestType()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getRequestType();

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getSegment()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getSegment();

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getObjective()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getObjective();

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getDebtType()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getDebtType();

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getCustType()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getCustType();

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost]
        public IHttpActionResult getDept()
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var results = app.getDept();

                return Json(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getFormData([FromUri] decimal DOC_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var result = app.getFormData(DOC_ID, this.getLogonUser());

                return Json(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        //public System.Text.StringBuilder getInnerException(Exception ex)
        //{
        //    System.Text.StringBuilder msg = new System.Text.StringBuilder();
        //    if (ex != null)
        //    {
        //        msg.Append(ex.Message);
        //        msg.Append(Environment.NewLine);
        //        return msg.Append(this.getInnerException(ex.InnerException));
        //    }
        //    else
        //    {
        //        return msg;
        //    }
        //}
        [HttpPost]
        public IHttpActionResult setFormData(MODEL.REQUEST_FORM formData)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var result = app.setFormData(formData, this.getLogonUser());

                if (formData.REQUEST_RUNNING_ID == 0)
                {
                    W4 w4 = new W4();

                    result.ACT_HIST_ID = w4.createW4(result.REQUEST_RUNNING_ID, this.getLogonUser());
                }

                return Json(result);
            }
            catch (Exception ex)
            {
                throw new Exception(this.getInnerException(ex).ToString());
            }
        }
        [HttpPost]
        public IHttpActionResult setFormDataProject(MODEL.REQUEST_FORM formData)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var result = app.setFormDataProject(formData, this.getLogonUser());

                if (formData.REQUEST_RUNNING_ID == 0)
                {
                    W4 w4 = new W4();

                    w4.createW4(result.REQUEST_RUNNING_ID, this.getLogonUser());
                }

                return Json(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost, HttpGet]
        public IHttpActionResult getW4actionReason([FromUri] decimal ACT_ID)
        {
            try
            {
                W4 w4 = new W4();

                var data = w4.getW4actionReason(ACT_ID);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost, HttpGet]
        public IHttpActionResult getW4actionValid([FromUri] decimal DOC_ID, [FromUri] decimal ACT_ID)
        {
            try
            {
                W4 w4 = new W4();

                var data = w4.beforeActionValidation(ACT_ID, DOC_ID);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost, HttpGet]
        public IHttpActionResult getW4history([FromUri] decimal DOC_ID)
        {
            try
            {
                W4 w4 = new W4();

                var data = w4.getW4history(DOC_ID);

                return Json(new { success = true, data = data });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpGet]
        public IHttpActionResult getColleteralType([FromUri] decimal DOC_ID)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var result = app.getMainColleteralType(DOC_ID);

                return Json(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public IHttpActionResult getColleteralSubType(string MAIN_CODE)
        {
            try
            {
                APPRAISAL app = new APPRAISAL();

                var result = app.getColleteralSubType(MAIN_CODE);

                return Json(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public IHttpActionResult w4action(MODEL.WebApi.W4ActionParam param)
        {
            W4 w4 = new W4();

            var result = w4.w4Action(param, this.getLogonUser());

            return Json(result);
        }

        public MODEL.USER getLogonUser()
        {
            USER user = new USER();

            return user.getLogonUserInfo(this.User.Identity.Name);
        }

        private System.Text.StringBuilder getInnerException(Exception ex)
        {
            System.Text.StringBuilder msg = new System.Text.StringBuilder();
            if (ex != null)
            {
                msg.Append(ex.Message);
                msg.Append(Environment.NewLine);
                return msg.Append(this.getInnerException(ex.InnerException));
            }
            else
            {
                return msg;
            }
        }

        [HttpPost, HttpGet]
        public IHttpActionResult getDispatcherOU([FromUri] string REQUEST_RUNNING_ID)
        {
            USER user = new USER();

            var results = user.getDispatcherOU(Convert.ToDecimal(REQUEST_RUNNING_ID), this.getLogonUser());

            return Json(results);
        }
        [HttpPost, HttpGet]
        public IHttpActionResult getAppraiserOU([FromUri] string REQUEST_RUNNING_ID)
        {
            USER user = new USER();

            var results = user.getAppraiserDOA(Convert.ToDecimal(REQUEST_RUNNING_ID), this.getLogonUser());

            return Json(results);
        }
        [HttpPost, HttpGet]
        public IHttpActionResult getApproversOU([FromUri] string REQUEST_RUNNING_ID)
        {
            USER user = new USER();

            var results = user.getApproversDOA(Convert.ToDecimal(REQUEST_RUNNING_ID), this.getLogonUser());

            return Json(results);
        }
        [HttpGet]
        public IHttpActionResult setDispatcherOU([FromUri] int REQUEST_RUNNING_ID, [FromUri] int OU_ID)
        {
            try
            {
                W4 w4 = new W4();

                w4.setDispatcherOU(REQUEST_RUNNING_ID, OU_ID);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, ex = ex.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult setAppraiserOUsetApproverOU([FromBody] MODEL.WebApi.W4SetAppraiserSetApprover param)
        {
            try
            {
                W4 w4 = new W4();

                w4.setAppraiserOU(param.DOC_ID, param.APPRAISER_OU, param.APPRAISER_TYPE);
                w4.setApproverOU(param.DOC_ID, param.APPROVER_OU);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, ex = ex.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult getChangableState(int REQUEST_RUNNING_ID)
        {
            W4 w4 = new W4();

            var results = w4.getChangableState(REQUEST_RUNNING_ID);

            return Json(results);
        }

        [HttpGet]
        public IHttpActionResult getRoleMenus([FromUri] string ID)
        {
            W4 w4 = new W4();

            var result = w4.getRoleMenus(ID);

            return Json(result);
        }

        [HttpGet]
        public IHttpActionResult getTables()
        {
            return Json(new { });
            //using (BPMEF.Entities db = new BPMEF.Entities())
            //{
            //    db.Database.Connection.Open();

            //    var tables = db.Database.Connection.GetSchema("TABLES").AsEnumerable().Where(s => s["OWNER"].ToString() == "AAGAPP").Select(r => new MODEL.NAME_VALUE()
            //    {
            //        NAME = r["TABLE_NAME"].ToString(),
            //        VALUE = r["TABLE_NAME"].ToString()
            //    });

            //    return Json(tables);
            //}
        }

        [HttpGet]
        public IHttpActionResult getTableColumns([FromUri] string t)
        {
            return Json(new { });
            //using (BPMEF.Entities db = new BPMEF.Entities())
            //{
            //    db.Database.Connection.Open();

            //    var tables = db.Database.Connection.GetSchema("COLUMNS", new string[] { null, t });

            //    return Json(tables);
            //}
        }

        [HttpGet]
        public IHttpActionResult getTableData([FromUri] string t)
        {
            return Json(new { });
            //using (BPMEF.Entities db = new BPMEF.Entities())
            //{
            //    db.Database.Connection.Open();

            //    System.Data.Common.DbProviderFactory dbfac = System.Data.Common.DbProviderFactories.GetFactory(db.Database.Connection);

            //    var dbCommand = dbfac.CreateCommand();

            //    dbCommand.Connection = db.Database.Connection;

            //    string qry = string.Format("SELECT * FROM {0}", t);

            //    dbCommand.CommandType = CommandType.Text;
            //    dbCommand.CommandText = qry;

            //    DataTable dt = new DataTable("data");

            //    System.Data.Common.DbDataReader rd = dbCommand.ExecuteReader(CommandBehavior.Default);

            //    dt.Load(rd);

            //    return Json(dt);
            //}
        }
    }
}
