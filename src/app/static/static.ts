import * as vars from './../static/static-config';
'use strict';
// export const customerPublicIP: string = 'http://61.16.138.198';
export const customerPublicIP: string = 'https://api.solarbyluminous.com/';
export const portNo: number = 8778;
export var API_BASE_URL: string = vars.vars.API_BASE_URL;
export const IcallMateURL: string = `${customerPublicIP}:${portNo}`;
export var SEARCH_RESULT_DOWNLOAD_PATH: string = vars.vars.SEARCH_RESULT_DOWNLOAD_PATH;
export var STRIP_IMAGE_PATH: string = vars.vars.STRIP_IMAGE_PATH;
console.warn("@@", vars.vars)
export var APIS: any = {
      "CONSUMER_REGISTER": `${API_BASE_URL}/registerUser`,
      "GENERATE_OTP": `${API_BASE_URL}/generateOTP/`,
      "CONSUMER_LOGIN": `${API_BASE_URL}/loginUser`,
      "EMPLOYEE_LOGIN": `${API_BASE_URL}/loginEmployee`,
      "SURVEY_REQUEST": `${API_BASE_URL}/requestVisit`,
      "CCE_LEAD_INFO": `${API_BASE_URL}/ccelistLeadInfo`,
      "GET_CONSUMER_DATA": `${API_BASE_URL}/getConsumerData`,
      "CHANGE_CONSUMER_PASSWORD": `${API_BASE_URL}/createpassword`,
      "CONSUMER_PROJECTS_JOURNEYS": `${API_BASE_URL}/getConsumerJourny`,
      "CONSUMER_PROJECTS_JOURNEYS_VIEW": `${API_BASE_URL}/getConsumerJourny/1`,
      "SAVE_CONTACT_DATA": `${API_BASE_URL}/saveContactForm`,
      "GET_UPLOAD_MASTER_DATA": `${API_BASE_URL}/getUploadData/`,
      "UPLOAD_FILES": `${API_BASE_URL}/uploadDocuments`,
      "CONSUMER_NOT_INTERESTED": `${API_BASE_URL}/consumerNotInterested`,
      "CONSUMER_NO_RESPONSE": `${API_BASE_URL}/noResponse`,
      "CALL_RESCHEDULE": `${API_BASE_URL}/callReschedule`,
      "CCE_LEAD_FORM": `${API_BASE_URL}/listcceLeadbyid`,
      "CCE_LEAD_FORM_SUBMIT": `${API_BASE_URL}/createLeadData`,
      "GET_PROPOSAL_DATA": `${API_BASE_URL}/getProposalData`,
      "CALCULATE_ON": `${API_BASE_URL}/calculate`,
      "GET_STATE_MASTER": `${API_BASE_URL}/getStateMasterList`,
      "EDIT_CONSUMER_PROFILE": `${API_BASE_URL}/editConsumerData`,
      "SAVE_RESULT": `${API_BASE_URL}/saveCalculatedData`,
      "GET_BACKUP_TIME": `${API_BASE_URL}/getBackUpList`,
      "CONSUMER_RATING": `${API_BASE_URL}/addConsumerRatingfeedback`,
      "GET_CONSUMER_RATING": `${API_BASE_URL}/getConsumerRatingfeedback`,
      "CONSUMER_Grivances": `${API_BASE_URL}/addConsumerGrievance`,
      "GET_SITE_SURVEYOR_LIST": `${API_BASE_URL}/listProject`,
      "CONSUMER_PROJECT_MILESTONE": `${API_BASE_URL}/projectMilestoneChange`,
      "STATE_CITY": `${API_BASE_URL}/getLocalityMasterListByPinId`,
      "FORGOT_PASSWORD": `${API_BASE_URL}/forgotPassword`,
      "GET_PROJECT_DETAILS_FOR_CHECKLIST": `${API_BASE_URL}/projectChecklistDetail`,
      "SURVEYOR_DATA": `${API_BASE_URL}/getEmployeeListBySkillId`,
      "CHANGE_PROJECT_STATUS": `${API_BASE_URL}/statusChange`,
      "GET_DISTRICT_MASTER": `${API_BASE_URL}/getDistrictMasterListByStateId`,
      "GET_UPLOADED_DOCS_FOR_EMP": `${API_BASE_URL}/getDocuments`,
      "SAVE_EXTRA_DETAILS": `${API_BASE_URL}/saveExtraDetails`,
      "GET_FAQS": `${API_BASE_URL}/getFaqs`,
      "KART_PROJECT_VALUE": `${API_BASE_URL}/createKartData`,
      "STATUS_CHANGE_CONSUMER": `${API_BASE_URL}/statusChangeConsumer`,
      "GET_SURVEYOR_DATA": `${API_BASE_URL}/getSurveyFormData`,
      "GET_APPLIANCE_DATA": `${API_BASE_URL}/getApplianceAll`,
      "POST_SURVEYOR_DATA": `${API_BASE_URL}/createSurvey`,
      "PAY_FEE": `${API_BASE_URL}/getEncryptedData/`,
      "PAYMENT_GATEWAY": `https://logintest.ccavenue.com/apis/servlet/DoWebTrans`,
      "NEFT_GATE": `${API_BASE_URL}/saveVerificationData`,
      "UPLOAD_PAYMENTS": `${API_BASE_URL}/uploadPayments`,
      "GET_SURVEYOR_AUDIT_DATA": `${API_BASE_URL}/getSurveyorFormData`,
      "GET_PAYMENT_APPROVAL_LIST": `${API_BASE_URL}/getPaymentApprovalList`,
      "SAVE_RELEASE_DATA": `${API_BASE_URL}/savePaymentReleaseData`,
      "UPDATE_APPROVAL": `${API_BASE_URL}/updatePaymentApproval`,
      "GET_AUDITOR_DATA": `${API_BASE_URL}/getAuditorFormData`,
      "GET_SITE_SURVEYOR_CLAR_LIST": `${API_BASE_URL}/listClarification`,
      "GET_SITE_SURVEYOR_REJ_REMARKS": `${API_BASE_URL}/getRejectionRemarksData`,
      "EMPLOYEES_DATA_BY_ROLE": `${API_BASE_URL}/getEmployeesDataByRole`,
      "GET_RELEASE_REQUEST_LIST": `${API_BASE_URL}/getReleaseRequestList`,
      "UPDATE_RELEASE_DATA": `${API_BASE_URL}/updatePaymentReleaseData`,
      "PROJECT_STATUS_DATA": `${API_BASE_URL}/getProjectStatusData`,
      "PROJECT_STATUS_DATA_LIST": `${API_BASE_URL}/listProjectStatus`,
      "GET_PREFILLED_SURVEY_DATA": `${API_BASE_URL}/getSurveyPrefilledData`,
      "STATUS_PROPOSAL_TAB": `${API_BASE_URL}/statusViewProposalTab`,
      "AUTO_SAVE": `${API_BASE_URL}/autoSave`,
      "IS_SITE_BOOKED": `${API_BASE_URL}/isSiteSurveyBooked`,
      "CONUMER_LEADS_FOR_OPS": `${API_BASE_URL}/listConsumerLeadsToOps`,
      "QUERY_LIST": `${API_BASE_URL}/getQueryList`,
      "UPDATE_QUERY": `${API_BASE_URL}/updateQueryData`,
      "SUBMIT_PARTNER_DATA": `${API_BASE_URL}/createPartner`,
      "UPDATE_LEAD": `${API_BASE_URL}/saveLeadDataFromQuery`,
      "CHECK_ROLE_EXISTS": `${API_BASE_URL}/checkRoleExists`,
      "SEND_PAYMENT_KEY": `${API_BASE_URL}/sendPaymentKey`,
      "LEAD_BULK_UPLOAD": `${API_BASE_URL}/leadBulkUpload`,
      "SEARCH_PROJECT": `${API_BASE_URL}/searchProject`,
      "SEARCH_LEAD": `${API_BASE_URL}/searchLead`,
      "REGISTER_OR_LOGIN_SURVEY_REQUEST_CONSUMER": `${API_BASE_URL}/registerOrLoginSurveyRequestConsumer`,
      "SURVEYOR_REJECT_PROJECTS": `${API_BASE_URL}/getSurveyorRejections`,
      "REJECT_PROJECT_PERMANENTLY": `${API_BASE_URL}/rejectProjectPermanently`,
      "REALLOCATE_SURVEYOR": `${API_BASE_URL}/reallocateSurveyor`,
      "PROJECT_STATUS_LIST": `${API_BASE_URL}/projectStatusList`,
      "REVOKE_COLD_BUCKET_LEAD": `${API_BASE_URL}/revokeColdBucketLead`,
      "SAVE_CASH_PAYMENT": `${API_BASE_URL}/saveCashPayment`,
      "SAVE_CUSTOMER_IO": `${API_BASE_URL}/createUserOnCustomerIO`,
      "CREATE_STRIP_TEXT": `${API_BASE_URL}/createNewFooterStripText`,
      "GET_STRIP_TEXT": `${API_BASE_URL}/getActiveFooterStripText`,
      "PROJECT_CLOSE_REASON": `${API_BASE_URL}/getProjectCloseReason`,
      "ADD_PROJECT_STATUS": `${API_BASE_URL}/addNewProjectStatus`,
      "SUREVY_NOT_VISITED_REASON": `${API_BASE_URL}/getSurveyNotVisitedReason`,
      "EMAIL_FORGOT_PASSWORD": `${API_BASE_URL}/verifyEmailAddress`,
      "VERIFY_OTP_FORGOT_PASSWORD": `${API_BASE_URL}/verifyOtp`,
      "UPDATE_PASSWORD": `${API_BASE_URL}/updatePassword`,
      "GET_LEADS_SOURCE_LISTING": `${API_BASE_URL}/listLeadSourceMaster`,
      "DELETE_LEADS_SOURCE": `${API_BASE_URL}/removeLeadSourceMasterById`,
      "ADD_LEAD_SOURCE": `${API_BASE_URL}/InsertNewIntoLeadSourceMaster`,
      "UPDATE_LEAD_SOURCE": `${API_BASE_URL}/UpdateIntoLeadSourceMaster`,
      "TOGGLE_FOOTER_STRIP": `${API_BASE_URL}/changeVisibilityStatus`,
      "GET_PROPOSAL_EMAIL_DATA": `${API_BASE_URL}/getProposalEmailData`,
      "ALL_STATES": `${API_BASE_URL}/getStateMaster`,
      "ALL_CITIES": `${API_BASE_URL}/getAllDistricts`,
      "SITE_SURVEY_BY_DATE": `${API_BASE_URL}/listConsumerLeadByScheduleDate`,
      "PINCODE_LISTING": `${API_BASE_URL}/listLocalityPinmaster`,
      "REMOVE_LOCALITY": `${API_BASE_URL}/removeLocality`,
      "ADD_LOCALITY": `${API_BASE_URL}/addLocality`,
      "UPDATE_LOCALITY": `${API_BASE_URL}/updateLocality`,
      "MAKE_LEAD_IN_QUEUE": `${API_BASE_URL}/clearLockedLead`,
      "FOLLOW_UP_LISTING": `${API_BASE_URL}/followUpListing`,
      "FOLLOWUP_STATUS_LIST": `${API_BASE_URL}/getAllfollowUpStatus`,
      "UPADTE_CUSTOMER_DATA_FROM_CCELEAD_FOLLOWUP": `${API_BASE_URL}/updateCustomerDetailInCceLeadDataFromFollowUp`,
      "CUTOMER_INTERACTION_LISTING_FOLLOWUP": `${API_BASE_URL}/returnAllFollowUpIntractionsAndInitiateNew`,
      "SEND_CUSTOMER_EMAIL_SMS": `${API_BASE_URL}/sendEmailAndSms`,
      "UPDATE_FOLLOWUP_INTERACTION": `${API_BASE_URL}/rescheduleAndUpdateFollowUpIntraction`,
      "GET_PROPOSAL_HISTORY": `${API_BASE_URL}/getProposalHistory`,
      "LEAD_LIST_STATUS_MASTER": `${API_BASE_URL}/listLeadStatusMaster`,
      "SEND_REACHOUT_SMS": `${API_BASE_URL}/sendReachoutSms`,
      "PANEL_AND_INV": `${API_BASE_URL}/panelAndInv`,
      "DUTY_TAXES": `${API_BASE_URL}/dutyTaxesOps`,
      "FIXED_LOOKUP": `${API_BASE_URL}/fixedLookUpOps`,
      "FUNNEL_CONVERSION": `${API_BASE_URL}/funnelConversion`,
      "GBI_LOOKUP": `${API_BASE_URL}/gbiLookUpOps`,
      "VAR_LOOKUP": `${API_BASE_URL}/varLookUpOps`,
      "FOLLOW_UP_EMAIL_SMS": `${API_BASE_URL}/followUpMailSmsOps`,
      "AH_REFERENCE": `${API_BASE_URL}/ahOps`,
      "REVISED_PROPOSAL_FROM_FOLLOW_UP": `${API_BASE_URL}/listRevisedProposal`,
      "GET_EXISTING_LEAD_PROJECT_FOR_NUMBER": `${API_BASE_URL}/findExistingLAndPForNumber`,
      "UPDATE_EX_LEAD": `${API_BASE_URL}/updateExistingLead`,
      "UPDATE_EX_PROJECT": `${API_BASE_URL}/updateExistingProject`,
      "GET_FOLLOWUP_REJECTION": `${API_BASE_URL}/getFollowupRejections`,
      "GET_COLDBUCKET_LEADS_PROJECTS": `${API_BASE_URL}/getColdBucketLeadAndProject`,
      "REVIVE_COLDBUCKET_LEADS": `${API_BASE_URL}/reviveColdBucketLead`,
      "REVIVE_COLDBUCKET_PROJECT": `${API_BASE_URL}/reviveColdBucketProject`,
      "EMPLOYEE_MASTER": `${API_BASE_URL}/employeeMasterOps`,
      "ROLE_MASTER": `${API_BASE_URL}/roleMasterOps`,
      "SKILL_MASTER": `${API_BASE_URL}/skillMasterOps`,

      "MISSED_CALL_LOGS": `${API_BASE_URL}/listCallLogs`,
      "GET_ALL_REJECTION_REMARK": `${API_BASE_URL}/allRejectionRemark`,
      "GET_ALL_LEAD_STATUS": `${API_BASE_URL}/allLeadStatus`,
      "GET_ROLE_MAPING": `${API_BASE_URL}/listRoleMap`,
      "SUBMIT_ROLE_MAP": `${API_BASE_URL}/submitRoleMap`,
      "SEND_PROPOSAL_EMAIL": `${API_BASE_URL}/sendProposalEmailUrl`,
      "CREATE_PDF": `${API_BASE_URL}/createPDF`,
      "GET_ALL_LEAD_PROJECTS": `${API_BASE_URL}/getAllLeadAndProject`,
      "GET_LEAD_PROJECT_DETAIL": `${API_BASE_URL}/getLeadAllDetail`,
      "MISSED_CALL_CREATE_LEAD": `${API_BASE_URL}/createMissedCallLead`,
      "PARTNER_QUERY_DATA": `${API_BASE_URL}/savePartnerData`,
      "ALL_PROJECT_STATE": `${API_BASE_URL}/allProjectState`,
      "ALL_LEAD_STATE": `${API_BASE_URL}/allLeadStatus`,
      "LOCK_RELEASE_LEADS": `${API_BASE_URL}/ccelistLockRelease`,
      "SELECT_PROPOSALS": `${API_BASE_URL}/selectProposal`,
      "GET_PARTNER_QUERY": `${API_BASE_URL}/partnerQuery`,
      "CREATE_LEAD_FROM_PARTNER": `${API_BASE_URL}/createLeadFromPartner`,
      "PARTNER_NO_RESPONSE": `${API_BASE_URL}/partnerNoResponse`,
      "GET_PARTNER_QUERY_USER": `${API_BASE_URL}/listpartnerQueryUser`,
      "SUBMIT_PARTNER_QUERY": `${API_BASE_URL}/submitPartnerQuery`,
      "MISSED_CALL_ACTION": `${API_BASE_URL}/missedCallAction`,
      "CCE_LEAD_LISTING": `${API_BASE_URL}/cceLeadListing`,
      "PARTNER_RESCHEDULE": `${API_BASE_URL}/partnerRescheduleQuery`,
      "PARTNER_LOG_HISTORY": `${API_BASE_URL}/partnerLogHistory`,
      "DELETE_PDOC": `${API_BASE_URL}/deletePdoc`,
      "GET_ALL_EMPLOYEE": `${API_BASE_URL}/getEmployeeList`,
      "GET_REFRENCE_LIST": `${API_BASE_URL}/getLeadRefrences`,
      "DELETE_REFRENCE": `${API_BASE_URL}/removeLeadRefrence`,
      "SUBMIT_LEAD_REFRENCE": `${API_BASE_URL}/submitLeadRefrence`,
      "GET_SURVEYOR_HANDOFF_DATA": `${API_BASE_URL}/surveyor-handoff`,
      "GET_HANDOFF_DATA": `${API_BASE_URL}/handoff-data`,
      "SUBMIT_HANDOFF_DATA": `${API_BASE_URL}/submitHandoff`,
      "GET_SUBMITTED_HANDOFF_LIST": `${API_BASE_URL}/handoffList`,
      "SUBMIT_PM_Allocation": `${API_BASE_URL}/assignProjectManager`,
      "GET_PROJECTS_LIST_PM": `${API_BASE_URL}/ProjectsListPM`,
      "ACCEPT_REJECT_PM": `${API_BASE_URL}/actionProjectManager`,
      "SUBMIT_CALENDER_PM": `${API_BASE_URL}/addCalenderPlan`,
      "VIEW_PROJECT_PLAN": `${API_BASE_URL}/view_project_plan`,
      "INSOLATION_OPS": `${API_BASE_URL}/insolationOps`,
      "LEADS_LISTING_CCE": `${API_BASE_URL}/leadListingCce`,
      "UPDATE_LEAD_PRIORITY": `${API_BASE_URL}/updateLeadPriority`,
      "UPDATE_SETTING": `${API_BASE_URL}/updateSetting`,
      "GET_SETTING": `${API_BASE_URL}/getSetting`,
      "GET_FOLLOWUP_INTERACTION": `${API_BASE_URL}/getAllFollowupInteractionFromProjectId`,
      "SUBMIT_MILESTONE_CALENDAR": `${API_BASE_URL}/add_milestone_project_plan`,
      "GETPROJECTPLAN": `${API_BASE_URL}/getProjectPlan`,
      "SUBMIT_TASK_DATA": `${API_BASE_URL}/add_task`,
      "GET_UPLOADED_DOCS_FOR_TASK": `${API_BASE_URL}/getTaskDocuments`,
      "GET_UPLOADED_DOCS_FOR_TASK_AUDITWISE": `${API_BASE_URL}/getTaskDocuments_auditwise`,
      "UPLOAD_TASK_DOCUMENTS": `${API_BASE_URL}/uploadTaskDocuments`,
      "GETMILESTONETASKS": `${API_BASE_URL}/get_milestone_tasks`,
      "SUBMIT_ONGOING_PROJECT": `${API_BASE_URL}/taskcomplete`,
      "REJECTALLOCATION": `${API_BASE_URL}/reverttositesurveyour`,
      "GETHANDOFFREMARK": `${API_BASE_URL}/gethandoff_remark`,
      "SENDTASKNOTIFICATION": `${API_BASE_URL}/sendtasksmsnotifications`,
      "SENDEMAILTASKNOTIFICATION": `${API_BASE_URL}/sendtaskemailnotifications`,
      "GET_TASK_LOGS": `${API_BASE_URL}/getTaskLogs`,
      "GET_TASK_ALLOCATED": `${API_BASE_URL}/gettaskallocated`,
      "DELETE_TASKPDOC": `${API_BASE_URL}/deletetask_document`,
      "NOTIFY_TASK_PARTNER": `${API_BASE_URL}/notifytask_partner`,
      "GET_VALID_URL_TASK": `${API_BASE_URL}/check_valid_url_task_partner`,
      "SAVE_TASK_NOTIFY_PARTNER": `${API_BASE_URL}/save_task_partner_bylink`,
      "GET_AUDITOR_LISTING": `${API_BASE_URL}/auditorListing`,
      "GET_TASK_INFO_TASKID_PPID": `${API_BASE_URL}/get_task_info_by_pp_id`,
      "SAVE_AUDIT_TASK_DATA": `${API_BASE_URL}/save_audit_task_data`,
      "SAVE_INSTALLATIONAUDIT_TASK_DATA": `${API_BASE_URL}/save_installationaudit_task_data`,
      "GET_INSTALLATIONAUDIT_TASK_DATA": `${API_BASE_URL}/get_installationaudit_task_data`,
      "GETPROJECTDETAIL": `${API_BASE_URL}/getProjectDetail`,
      "COMMERCIAL_PROJECTS": `${API_BASE_URL}/addCommercialProject`,
      "SEND_SMS": `${API_BASE_URL}/sendSMS`,
      "PROJECT_CONTACTS": `${API_BASE_URL}/project_contacts`,
      "PAYMENT_REQUEST_FINANCE": `${API_BASE_URL}/financeListing`,
      "MAKE_CALL": `${IcallMateURL}/iCallMateWebSvc/resources/MakeCall`,
      "SCRIPT": `${API_BASE_URL}/scriptexecution`,
      "F_DASHBOARD": `${API_BASE_URL}/funneldashboard`,
};
export const ROLES = {
      CONSUMER_ROLE: 23,
};

export const ALL_ROLES = {
      4: 'Auditor',
      5: 'CCE',
      22: 'Site Surveyor',
      8: 'Solution Designer',
      17: 'Ops Head',
      9: 'Finance',
      24: 'Partner',
      25: 'CCE Supervisor',
      13: 'Marketing',
      26: 'Admin',
      27: 'Funnel',
      28: 'Partner Query User',
      29: 'Project manager',
      30: 'Project manager(view)',
};

export const TIMES = {
      1: '10:00-12:00',
      2: '12:00-14:00',
      3: '14:00-16:00',
      4: '16:00-18:00'
};

export const OP_SOURCE = {
      0: 'AC',
      1: 'DC'
};

export const QUAL = {
      0: 'FAILED',
      1: 'QUALIFIED'
};

export const YES_NO = {
      0: 'No',
      1: 'Yes'
};

export const PHASE = {
      'single_phase': 'SINGLE',
      'three_phase': 'Yes'
};

export const LEAD_STATES = {
      '2': 'Rescheduled',
      '4': 'No Response',
      '7': 'Fresh Lead',
      '5': 'Not Interested',
      '3': 'Disqualified'
};

export const LOGIN = {
      BLANK_FIELD: 'Mandatory Field',
      PATTERN_ERROR: 'Please enter a valid 10 digit mobile no.',
      OTP: 'Please Enter Valid 4 Digit OTP Number.',
      OTP_SUCCESS: 'OTP has been sent to mobile',
      OTP_ERROR: 'Please try again otp has not been sent',
      OTP_GET: 'Please enter mobile number to get OTP'
};

export const REGISTER = {
      BLANK_FIELD: 'Mandatory Field',
      FNAME: 'Please enter a valid first name.',
      MNAME: 'Please enter a valid middle name.',
      LNAME: 'Please enter a valid last name.',
      EMAIL_PATTERN: 'Please enter a valid email address.',
      MOBILENO_PATTERN: 'Please enter a valid 10 digit mobile no.',
      OTP_PATTERN: 'Please enter a valid OTP number.',
      OTP_SUCCESS: 'OTP has been sent to mobile.',
      OTP_ERROR: 'Please try again otp has not been sent.',
      OTP_GET: 'Please enter mobile number to get OTP.',
      VERIFY: 'Please verify your mobile no. by OTP to proceed.'
};


export const SITE_SURVEY = {
      BLANK_FIELD: 'Mandatory Field',
      FNAME: 'Please enter a valid first name.',
      MNAME: 'Please enter a valid middle name.',
      LNAME: 'Please enter a valid last name.',
      MOBILENO_PATTERN: 'Please enter a valid 10 digit mobile no.',
      OTP_SUCCESS: 'OTP has been sent to mobile.',
      OTP_ERROR: 'Please try again OTP has not been sent.',
      WRONG_OTP: 'Please enter correct OTP or validate again.',
      PINCODE: 'Please enter a valid pincode.',
      LANDMARK: 'Please enter a valid landmark.',
      VERIFY_NUMBER: 'Please verify your mobile no. by OTP to proceed.',
      PERMISSION: 'Please accept terms and conditions to proceed.',
      // OTHER_STATE : 'Service is applicable in Haryana, Delhi and Uttar Pradesh for now.',
      OTHER_STATE: 'Sorry! We’re not available in your city yet.',
      EMAIL_PATTERN: 'Please enter a valid email address.',
      PAY_WAVED_OFF: 'CONGRATULATIONS!! As a special introductory offer we are pleased to waive-off the site survey charges! We will contact you soon.',
      OTHER_CITY: 'Sorry! We’re not available in your city yet.',
      REQUEST_SUCCESS_POPUP_MSG: "Your request for callback has been booked. We'll get back to you soon.",
};


export const CONTACT_US = {
      BLANK_NAME: 'Name is required.',
      NAME_PATTERN: 'Please enter a valid name.',
      BLANK_ADDRESS: 'Address is required.',
      BLANK_MOBILENO: 'Mobile is required.',
      MOBILENO_PATTERN: 'Please enter a valid 10 digit mobile no.',
      BLANK_EMAIL: 'Email is required.',
      EMAIL_PATTERN: 'Please enter a valid email address.',
      BLANK_QUERY: 'Query is required.'
};

export const HOME = {
      BLANK_MOBILENO: 'Mandatory Field',
      MOBILE_PATTERN: 'Please enter a valid 10 digit mobile no.'
};

export const FORGOT_PASSWORD = {
      FORGOT_CONSUMER: 'Please verify your mobile no. by OTP to proceed',
      IS_OTP_SENT: 'OTP has been sent to mobile',
      IS_OTP_ERROR: 'Please try again otp has not been sent',
      IS_MOBILE_VALID: 'Please enter a valid 10 digit mobile no.',
      BLANK_FIELD: 'Mandatory Field',
      OTP_ERROR: 'Please enter a valid OTP number.'
};
export const SOCIAL = {
      FB: 'https://www.facebook.com/myluminous',
      TWITTER: 'https://twitter.com/myluminous',
      LINKEDIN: 'https://www.linkedin.com/company/381991/',
      YOUTUBE: 'https://www.youtube.com/user/myluminousindia/featured'
};

export const LEAD_PANEL_FORM = {
      MOBILENO_PATTERN: 'Please enter a valid 10 digit mobile no.',
      EMAIL_PATTERN: 'Please enter a valid email address.',
      PINCODE: 'Please enter a valid pincode.',
      BLANK_FIELD: 'Mandatory Field'
}

export const CALCULATOR = {
      LOAD_MIN: 1,
      LOAD_CHANGE_BY: 1,
      UNIT_CHANGE_BY: 10,
      SIZE_MIN: 1,
      SIZE_CHANGE_BY: 0.25,
      AREA_MIN: 100,
      AREA_MAX: 2000,
      AREA_CHANGE_BY: 25,
      SOLARIZATION_MIN: 20,
      SOLARIZATION_MAX: 100,
      SOLARIZATION_CHANGE_BY: 5,
      INVESTMENT_MIN_ON: 80000,
      INVESTMENT_CHANGE_BY_ON: 20000,
      INVESTMENT_MIN_OFF: 90000,
      INVESTMENT_CHANGE_BY_OFF: 22500
}

export const SUCCESS = {
      0: 'Fail',
      1: 'Success'
};

export const REMARKABLE = ['4', '10', '14', '16', '20', '23', '27', '29', '33', '34', '36', '37'];
export const PAYMENT = '500';


export const SOLUTION_TYPE = {
      'on_grid': 'On Grid(Grid Tie)',
      'off_grid': 'Off Grid(Back-up)',
      'none': 'Not-Feasible'
}

export const SERVER_ERRORS = {
      INTERNET_OR_API_ACCESS: 'There is error due to internet connectivity or any server issue.',
}

export const BUILDING_TYPE = [
      { value: 'industrial', label: 'Industrial' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'residential', label: 'Residential' },
      { value: 'Institution', label: 'Institution' },
]

export const SOURCE_LIST = [
      { value: 'website', label: 'Website' },
      { value: 'social_media', label: 'Social Media' },
      { value: 'print_ads', label: 'Print Ads' },
      { value: 'tv', label: 'Tv' },
      { value: 'friends_and_family', label: 'Friends & Family' },
      { value: 'radio_channel', label: 'Radio' },
      { value: 'Print channel_partner', label: 'Channel Partner' },
      { value: 'missed_call', label: 'Missed Call data' },
      { value: 'others', label: 'Others' },
]