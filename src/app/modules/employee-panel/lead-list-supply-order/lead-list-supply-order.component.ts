import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { LeadListService } from "../services/lead-list.service";
import { ProjectManagementService } from "../../employee-panel/services/project-management.services";
import {
  FormBuilder,
  Validators,
  FormGroup,
  ValidationErrors
} from "@angular/forms";
import { Router } from "@angular/router";
import * as globals from "../../../static/static";
import { SharedServices } from "../../../services/shared.services";
import { PopupMessageService } from "./../../../modules/message/services/message.service";
import { ConfirmationService } from 'primeng/api';
import * as _ from 'lodash';
import * as InitialValues from './supplyOrder.constants';
import { LeadPanelService } from "app/modules/customer-care/services/lead-panel.service";

@Component({
  selector: "sd-lead-list",
  templateUrl: "./lead-list-supply-order.component.html",
  styleUrls: ["./lead-list-supply-order.component.css"],
})
export class LeadListSupplyOrder implements OnInit, OnDestroy {

  userData: any;
  subscription: Subscription;
  isListing: string;
  projectDocuments: any;
  baseurl: string;
  sol_id: any;
  isPaymentList: Boolean = false;
  paymentList: any = [];
  sodesignerform: FormGroup;
  isLeadSearchFormSubmitted: Boolean = false;
  panelSteps: number = 1;
  actionLoader: string = "";
  searchForm: FormGroup;
  searchLeadForm: FormGroup;
  unprocessedLeads: any = [];
  solutionType: any;
  proposalSolutionType: Array<any> = InitialValues.proposalSolutionType;
  proposalPanelType: Array<any> = InitialValues.proposalPanelType;
  showSmartSearchComponent: Boolean = true;
  loader: any;
  record: any;
  currentDate = new Date();
  submitted = false;
  isPdfExist = false;
  moduleCapacity;
  moduleMaterial;
  inverterRating1;
  inverterRating2;
  inverterRating3;
  inverterPhase1;
  inverterPhase2;
  inverterPhase3;
  inverterQuantity1;
  inverterQuantity2;
  inverterQuantity3;
  panelQuantity;
  panelType;
  onGridData = InitialValues.onGridData;
  offGridData = InitialValues.offGridData;
  hybridData = InitialValues.hybridData;
  annexture2;
  equipmentData = InitialValues.equipmentData;
  //solarPvModuleRating = InitialValues.solarPvModuleRating;
  solarPvModuleRating;
  solarPVModulesQty: number = 0;
  solutionTypeOptions = InitialValues.solutionTypeOptions;
  connectionType = InitialValues.connectionType;
  lightingOptions = InitialValues.lightingOptions;
  // Solar Inverter/PCU Rating
  solarInverterOngrid1PhRating = InitialValues.solarInverterOngrid1PhRating;
  solarInverterOngrid3PhRating = InitialValues.solarInverterOngrid3PhRating;
  solarInverterOngrid;
  solarInverterOffGrid;
  solarInverterHybrid;
  solarInverterOffGridHybridRating = InitialValues.solarInverterOffGridHybridRating;
  //Battery Rating*
  //batteryRatingOffgrid = InitialValues.batteryRatingOffgrid;
  batteryRatingOffgrid;
  // Remote Monitoring System Type Ongrid*
  remoteMonitoringSystemTypeOngrid = InitialValues.remoteMonitoringSystemTypeOngrid;
  // Remote Monitoring System Type Ongrid*
  remoteMonitoringSystemTypeHybrid = InitialValues.remoteMonitoringSystemTypeHybrid;
  // Zero Export Device Type*
  zeroExportDeviceType = InitialValues.zeroExportDeviceType;
  // Module Mounting Structure Type*
  moduleMountingStructureType = InitialValues.moduleMountingStructureType;
  // Project Engineer*
  projectEngineer = InitialValues.projectEngineer;
  // MMS structure
  mmsStructure = InitialValues.mmsStructure;
  syncAmountHide: boolean;
  projectType: string;
  public equipmentValueArray = [];
  formsection: any;
  actionable_lst: any = [];
  handoff_remark: any;
  handoff_data: any = [];
  partnerList: any = [];
  signatureList: any = [];
  randomParam: any;
  SolarInverterOptionsOffGird: Array<any> = InitialValues.SolarInverterOptionsOffGird;
  currentEmpId: any;
  supplyOrderCount:number = 0;
  supplyOrderFilePaths : {path: string, fileName:string}[] = [];
  uploadDocument: FormGroup;
  alwaysIgst: boolean = false;
  showSoDraft: boolean = true;

  SolarInverterNumber: Array<any> = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" }
  ];

  showInverter1 = true;
  showInverter2 = false;
  showInverter3 = false;

  constructor(
    private route: Router,
    private sharedServices: SharedServices,
    private formBuilder: FormBuilder,
    private leadListService: LeadListService,
    private popupMessageService: PopupMessageService,
    private projectManagementService: ProjectManagementService,
    private confirmationService: ConfirmationService,
    private leadPanelService: LeadPanelService
  ) {}


  ngOnInit() {
    if (localStorage.getItem("emp_auth_key")) {
      this.userData = JSON.parse(localStorage.getItem("userData"));
    }
    this.getAdminPreFilledValues();
    this.sol_id = JSON.parse(localStorage.getItem("userData"));
    this.currentEmpId = this.sol_id.emp_id;

    this.getLeadList_actionable();
    //this.getLeadListDetails();
    this.baseurl = globals.API_BASE_URL;
    this.randomNumber();
    this.createDocumentForm();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      //this.sodesignerform.reset();
    }
  }

  /**
   * Get Battery, Panels, Inverters
   */
   getAdminPreFilledValues() {

    let data;

      // Ongrid
      data = {type: 1};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let inverterItems = [];
            res.data.forEach(item => {
              inverterItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.solarInverterOngrid = inverterItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Offgrid
      data = {type: 2};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let inverterItems = [];
            res.data.forEach(item => {
              inverterItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.solarInverterOffGrid = inverterItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Hybrid
      data = {type: 3};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let inverterItems = [];
            res.data.forEach(item => {
              inverterItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.solarInverterHybrid = inverterItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Battery
      data = {type: 4};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let batteryItems = [];
            res.data.forEach(item => {
              batteryItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.batteryRatingOffgrid = batteryItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );

      // Panel
      data = {type: 5};
      this.leadPanelService.getInverterProducts(data).subscribe(
        res => {
          if(res.status) {
            let panelsItems = [];
            res.data.forEach(item => {
              panelsItems.push({
                value : item.product_value,
                label: item.product_label
              });
            });
            this.solarPvModuleRating = panelsItems;
          }
        },
        err => {
          this.popupMessageService.showError("Something went wrong", "Error");
        }
      );
  }

  /**
   * Set component values from proposal Data
   */
  setInitialBOMValuesFromProposal() {

    // Inverter 1,2,3 quantity
    this.inverterQuantity1 =
      +this.handoff_data.h_data.proposalDetails.proposal_inverter_quantity;
    this.inverterQuantity2 =
      +this.handoff_data.h_data.proposalDetails.proposal_inverter_quantity2;
    this.inverterQuantity3 =
      +this.handoff_data.h_data.proposalDetails.proposal_inverter_quantity3;

    // Inverter 1,2,3 rating
    this.inverterRating1 =
      this.handoff_data.h_data.proposalDetails.proposal_inverter_rating;
    this.inverterRating2 =
      this.handoff_data.h_data.proposalDetails.proposal_inverter_rating2;
    this.inverterRating3 =
      this.handoff_data.h_data.proposalDetails.proposal_inverter_rating3;

    // Inverter 1,2,3 Phase
    this.inverterPhase1 =
      this.handoff_data.h_data.proposalDetails.proposal_inverter_phase;
    this.inverterPhase2 =
      this.handoff_data.h_data.proposalDetails.proposal_inverter_phase2;
    this.inverterPhase3 =
      this.handoff_data.h_data.proposalDetails.proposal_inverter_phase3;


    // Module Capacity
    this.moduleCapacity =
      this.handoff_data.h_data.proposalDetails.proposal_module_capacity;

    // Module Material
    this.moduleMaterial =
      this.proposalPanelType[
        this.handoff_data.h_data.proposalDetails.proposal_panel_type - 1
      ].label;

    // Panel Quantity
    this.panelQuantity =
      this.handoff_data.h_data.proposalDetails.proposal_number_of_solar_panel;

    // Panel Type
    const panelType = this.handoff_data.h_data.proposalDetails.proposal_panel_type;

    switch(panelType) {
      case 1:
        this.panelType = "72-Cell Poly-Crystalline"
      case 2:
        this.panelType = "144-Cell Mono PERC Half Cut"
      case 3:
        this.panelType = "72-Cell Mono Crystalline"
      case 4:
        this.panelType = "72-Cell Mono Crystalline PERC"
      default:
        this.panelType = ""
    }

    // if (this.handoff_data.h_data.proposalDetails.proposal_solution_type == 3) {
    //   this.onGridData[0].value[1].component = "Solar Hybrid Inverter";
    // }

    /**
     * Update ongrid values
     */

    // Solar PV MOdules Desc
    const pvModuleDesc = this.updateBOMSolarPvModuleDesc(this.moduleCapacity)
    this.onGridData[0].value[0].description = pvModuleDesc;
    this.offGridData[0].value[0].description = pvModuleDesc;
    this.hybridData[0].value[0].description = pvModuleDesc;
    // Solar PV MOdules Qty
    this.onGridData[0].value[0].qty = this.panelQuantity;
    this.offGridData[0].value[0].qty = this.panelQuantity;
    this.hybridData[0].value[0].qty = this.panelQuantity;

    // Inverter Description
    this.onGridData[0].value[1].description = this.updateInverterDesc(this.inverterRating1, this.inverterPhase1, 'GTI');
    this.offGridData[0].value[1].description = this.updateInverterDesc(this.inverterRating1, this.inverterPhase1, 'PCU');
    this.hybridData[0].value[1].description = this.updateInverterDesc(this.inverterRating1, this.inverterPhase1, 'Hybrid');
    // Inverter Qty
    this.onGridData[0].value[1].qty = this.inverterQuantity1 + this.inverterQuantity2 + this.inverterQuantity3;

    // Battery Description
      const batteryDesc = this.updateBatteryDesc(this.handoff_data.h_data.proposalDetails.battery_volt);
      this.offGridData[0].value[2].description = batteryDesc;
      this.hybridData[0].value[2].description = batteryDesc;
    // Battery Qty
    this.offGridData[0].value[2].qty = this.handoff_data.h_data.proposalDetails.battery_nos;
    this.hybridData[0].value[2].qty = this.handoff_data.h_data.proposalDetails.battery_nos;

    // Set MMS
    // const mms = this.updateMMS();
    // this.onGridData[1].value[0].description = mms;
    // this.offGridData[1].value[0].description = mms;
    // this.hybridData[1].value[0].description = mms;

    // Update installation text
    const installationText = this.updateInstallationText();
    this.onGridData[9].value[4].description = installationText;
    this.offGridData[9].value[4].description = installationText;
    this.hybridData[9].value[4].description = installationText;

    this.getUploadedDocuments();

  }

  setFormValuesFromProposal() {
    // Set NRV Date from proposal
    const nrvDate = this.handoff_data.nrv_date;
    if (nrvDate) {
      this.sodesignerform.controls.so_nrv_date.patchValue(new Date(Date.parse(nrvDate)));
    } else {
      this.sodesignerform.controls.so_nrv_date.patchValue(new Date());
    }

    // Set Solution Type from Proposal
    const solutionType = this.handoff_data.h_data.proposalDetails.proposal_solution_type
    if(solutionType) {
      this.sodesignerform.controls.so_solution_type.patchValue(solutionType);
    }
    if(solutionType == 1) {
      this.setOnGridValidators();
    } else if(solutionType == 2) {
      this.setOffGridValidators();
    } else {
      this.setHybridValidators();
    }

    // Set IGST
    // const partnerState = 'abx';
    // const customerBillingState = 'xyz';

    // if (partnerState != customerBillingState) {
    //   this.sodesignerform.controls.so_igst.patchValue(1);
    //   this.sodesignerform.controls.so_igst.disable();
    // }
  }

  // Populate form from supply order data
  getSupplyOrderDetails() {
    if (localStorage.getItem("emp_auth_key")) {
      this.leadListService
        .getSupplyOrderDetails(this.handoff_data.h_projectid)
        .subscribe((res) => {
          if (res.status) {
            if (res.data.so_id) {
              let data = res.data;

              // If draft data is present then set the form values from the draft
              if (data.so_draft) {
                this.showSoDraft = true;
                let draftData = JSON.parse(data.so_draft);
                if(draftData.so_nrv_date) {
                  draftData.so_nrv_date = new Date(Date.parse(draftData.so_nrv_date))
                }

                this.sodesignerform.patchValue(draftData);
                this.annexture2 = draftData.so_bom;


              } else {
                this.showSoDraft = false;
                if (data.so_annexture) {
                  this.annexture2 = JSON.parse(data.so_annexture);

                }
                data = { ...data, so_nrv_date: new Date(Date.parse(data.so_nrv_date)) };
                this.sodesignerform.patchValue(data);

                this.supplyOrderCount = +data.pdf_count;
                this.generatePdfLinks();
                if (data.so_solution_type == 1) {
                  this.setOnGridValidators();
                } else if (data.so_solution_type == 2) {
                  this.setOffGridValidators();
                } else {
                  this.setHybridValidators();
                }
                if (res.data.so_always_igst == 1) {
                  this.alwaysIgst = true;
                  this.sodesignerform.controls.so_igst.patchValue('1');
                  this.sodesignerform.controls.so_igst.disable();
                }
                if (res.data.so_partner_id) {
                  this.sodesignerform.controls.so_partner_id.patchValue(res.data.so_partner_id);
                }
              }
            }
          } else {
            this.isPdfExist = false;
          }
        });
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  createSOForm(project_id?) {
    this.sodesignerform = this.formBuilder.group({
      so_lname: ["", Validators.compose([Validators.required])],
      so_fname: ["", Validators.compose([Validators.required])],
      so_mobileno: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
        ]),
      ],
      so_address: ["", Validators.compose([Validators.required])],
      so_gst: [
        "",
        [
          Validators.compose([Validators.pattern("[a-zA-Z0-9-_]{15}")]),
        ],
      ],
      so_email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      so_igst: ["", Validators.compose([Validators.required])],
      so_nrv_date: ["", Validators.compose([Validators.required])],
      so_solarpv: ["", Validators.compose([Validators.required])],
      so_solarpv_rat: ["", Validators.compose([Validators.required])],
      so_solarpv_qty: ["", Validators.compose([Validators.required])],
      so_solution_type: ["", Validators.compose([Validators.required])],
      so_connection_type: ["", Validators.compose([Validators.required])],
      so_solarinverter: ["", Validators.compose([Validators.required])],
      so_solarinverter2: [""],
      so_solarinverter3: [""],
      proposal_inverter_number: ["1", Validators.compose([Validators.required])],
      so_solarinverter_rat : ["", Validators.compose([Validators.required])],
      so_solarinverter_rat2 : [""],
      so_solarinverter_rat3 : [""],
      so_solarinverter_qty: ["", Validators.compose([Validators.required])],
      so_solarinverter_qty2: [""],
      so_solarinverter_qty3: [""],
      so_battery: ["", Validators.compose([Validators.required])],
      so_battery_rating: ["", Validators.compose([Validators.required])],
      so_battery_qty: ["", Validators.compose([Validators.required])],
      so_remote_monitoring : ["", Validators.compose([Validators.required])],
      so_remote_monitoring_type: ["",Validators.compose([Validators.required]),],
      so_remote_monitoring_qty: ["", Validators.compose([Validators.required])],
      so_platform : ["", Validators.compose([Validators.required])],
      so_zero_export_device_type: ["",Validators.compose([Validators.required]),],
      so_zero_export_device_qty: ["",Validators.compose([Validators.required]),],
      so_zero_export_device : ["",Validators.compose([Validators.required]),],
      so_mounting_structure_type: ["",Validators.compose([Validators.required]),],
      so_mountring_structure: ["", Validators.compose([Validators.required])],
      so_mms: ["", Validators.compose([Validators.required])],
      so_tilt_angle: ["", Validators.compose([Validators.required])],
      // so_platform: [
      //   "",
      //   Validators.compose([
      //     Validators.required,
      //     Validators.min(0),
      //     Validators.max(100),
      //   ]),
      // ],
      so_ssp_scope: [""],
      so_partner_id: ["", Validators.compose([Validators.required])],
      so_projectengineer: [
        "",
        Validators.compose([Validators.required]),
      ],
      so_opshead: ["KAMTA KUSHWAHA", Validators.compose([Validators.required])],
      so_sblbusinesshead: ["SANJAY KVS", Validators.compose([Validators.required])],
      so_project_id: [project_id, Validators.compose([Validators.required])],
      so_is_billing_shipping_same: [0],
      so_annexture1_additional_text: [""],
      so_lightingArrester: ["", Validators.compose([Validators.required])],
      so_bom: [this.annexture2],
    });
    this.formControlValueChanged();
    this.getpartnerListArray();
    this.setFormValuesFromProposal();
  }

  public createDocumentForm() {
    this.uploadDocument = this.formBuilder.group({
      uploadDocumentFile: ["", [Validators.required]],
    });
  }

  // Watch form changes and update BOM Details
  formControlValueChanged() {
    // Solar PV Modules Rating
    this.sodesignerform.get("so_solarpv_rat").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateBOMSolarPvModuleDesc(data);
        this.annexture2[0].value[0].description = text;
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });
    //Solar PV Modules Qty
    this.sodesignerform.get("so_solarpv_qty").valueChanges.subscribe((qty) => {
      if (qty) {
        this.annexture2[0].value[0].qty = qty;
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // Solar grid-tied Inverter 1
    this.sodesignerform.get("so_solarinverter_rat").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateInverterDesc(data, this.sodesignerform.controls.so_connection_type.value, "GTI");
        //this.annexture2[0].value[1].description = text;
        //this.annexture2[0].value.find(item => item.id === id);
        this.updateBomDescription(2, text);
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });
    // Solar grid-tied Inverter qty2
    this.sodesignerform.get("so_solarinverter_qty").valueChanges.subscribe((qty) => {
      if (qty) {
        //this.annexture2[0].value[1].qty = qty;
        this.updateBomQty(2, qty)
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // Solar grid-tied Inverter 2
    this.sodesignerform.get("so_solarinverter_rat2").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateInverterDesc(data, this.sodesignerform.controls.so_connection_type.value, "GTI");
        this.updateBomDescription(2.2, text);
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });
    // Solar grid-tied Inverter qty2
    this.sodesignerform.get("so_solarinverter_qty2").valueChanges.subscribe((qty) => {
      if (qty) {
        this.updateBomQty(2.2, qty)
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // Solar grid-tied Inverter 3
    this.sodesignerform.get("so_solarinverter_rat3").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateInverterDesc(data, this.sodesignerform.controls.so_connection_type.value, "GTI");
        this.updateBomDescription(2.3, text);
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });
    // Solar grid-tied Inverter qty3
    this.sodesignerform.get("so_solarinverter_qty3").valueChanges.subscribe((qty) => {
      if (qty) {
        this.updateBomQty(2.3, qty)
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });


    // Zero export Desc
    this.sodesignerform.get("so_zero_export_device_type").valueChanges.subscribe((data) => {
      if (data) {
        if(this.getSolutionType == 1) {
          const text = data
          //this.annexture2[0].value[2].description = text;
          this.updateBomDescription(3, text);
          this.sodesignerform.controls.so_zero_export_device_qty.enable();
          this.sodesignerform.controls.so_zero_export_device.enable();
          if(data === '0') {
            //this.annexture2[0].value[2].description = 'Not Required';
            this.updateBomDescription(3, 'Not Required');
            this.sodesignerform.controls.so_zero_export_device_qty.patchValue(0);
            //this.annexture2[0].value[2].qty = 0;
            this.updateBomQty(3, 0)
            this.sodesignerform.controls.so_zero_export_device.patchValue(0);
            this.sodesignerform.controls.so_zero_export_device_qty.disable();
            this.sodesignerform.controls.so_zero_export_device.disable();
          }
        }
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // Zero export Qty
    this.sodesignerform.get("so_zero_export_device_qty").valueChanges.subscribe((qty) => {
      if (qty) {
        if(this.getSolutionType == 1) {
          //this.annexture2[0].value[2].qty = qty;
          this.updateBomQty(3, qty)
          this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
        }
      }
    });

    // Remote monitoring
    this.sodesignerform.get("so_remote_monitoring_type").valueChanges.subscribe((data) => {
      if (data) {
        if(this.getSolutionType == 1 || this.getSolutionType == 3) {
          const text = this.updateRemoteMonitoring(data);
          //this.annexture2[0].value[3].description = text;
          this.updateBomDescription(4, text);
          this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
        }

      }
    });
    // Remote monitoring qty
    this.sodesignerform.get("so_remote_monitoring_qty").valueChanges.subscribe((qty) => {
      if (qty) {
        if(this.getSolutionType == 1 || this.getSolutionType == 3) {
          //this.annexture2[0].value[3].qty = qty;
          this.updateBomQty(4, qty)
          this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
        }
      }
    });

    // Tilt angle
    this.sodesignerform.get("so_tilt_angle").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateMMS();
        this.annexture2[1].value[0].description = text;
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // MMS Type
    this.sodesignerform.get("so_mounting_structure_type").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateMMS();
        this.annexture2[1].value[0].description = text;
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // MMS Material
    this.sodesignerform.get("so_mms").valueChanges.subscribe((data) => {
      if (data) {
        const text = this.updateMMS();
        this.annexture2[1].value[0].description = text;
        this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      }
    });

    // Battery
    this.sodesignerform.get("so_battery_rating").valueChanges.subscribe((data) => {
      if (data) {
        if(this.getSolutionType == 2 || this.getSolutionType == 3) {
          const text = this.updateBatteryDesc(data);
          //this.annexture2[0].value[2].description = text;
          this.updateBomDescription(3, text);
          this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
        }

      }
    });
    // Battery qty
    this.sodesignerform.get("so_battery_qty").valueChanges.subscribe((qty) => {
      if (qty) {
        if(this.getSolutionType == 1 || this.getSolutionType == 3) {
          //this.annexture2[0].value[2].qty = qty;
          this.updateBomQty(3, qty);
          this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
        }
      }
    });

    // Light Arrestor
    this.sodesignerform.get("so_lightingArrester").valueChanges.subscribe((data) => {
      this.updateLightingArrestorText();
    });

    // Partner Changed
    this.sodesignerform.get("so_partner_id").valueChanges.subscribe((data) => {
      const partnerData = this.partnerList.filter(x => x.value == data);
      //console.log(partnerData);
      if(partnerData.length) {
        const partnerState = partnerData[0]['state'];
        const customerState = this.handoff_data.h_data.cceLeaddata.cceld_state;
        //console.log(partnerState);
        //console.log(customerState);

        if(partnerState == customerState) {
          this.sodesignerform.controls.so_igst.patchValue(0);
          this.sodesignerform.controls.so_igst.enable();
          //console.log("states are same");
        } else {
          this.sodesignerform.controls.so_igst.patchValue(1);
          this.sodesignerform.controls.so_igst.disable();
          //console.log("states are different");
        }
      } else {
        this.sodesignerform.controls.so_igst.patchValue(0);
        this.sodesignerform.controls.so_igst.enable();
        //console.log("No default partner assigned to project");

      }

    });

    console.log("before so_solution_type change");

      this.sodesignerform.get('so_solution_type').valueChanges.subscribe(val => {
        //console.log('data',data);

        // if(data) {
        //   const event = {
        //     value: data
        //   }
        //   //this.solutionTypeChanged(event);
        //   if
        // }
        if(val == 1) {
          this.setOnGridValidators();
        }

        if(val == 2) {
          this.setOffGridValidators();
        }

        if(val ==3) {
          this.setHybridValidators();
        }
      })

    this.sodesignerform.get("proposal_inverter_number").valueChanges.subscribe(data => {
      console.log(data);
      /**
       * Data is number of different inverters
       * 1 = Inverter 1
       * 2 = Inverter 1 and 2
       * 3 = Inverter 1, 2 and 3
       */
      if(data == 1) {
        this.showInverter2 = false;
        this.showInverter3 = false;
        this.toggleInverter2Validaton(false);
        this.toggleInverter3Validaton(false);
        this.updateBomChekbox(2.2, false);
        this.updateBomChekbox(2.3, false);
      } else if(data == 2) {
        this.showInverter2 = true;
        this.showInverter3 = false;
        this.toggleInverter2Validaton(true);
        this.toggleInverter3Validaton(false);
        this.updateBomChekbox(2.2, true);
        this.updateBomChekbox(2.3, false);
      } else if(data == 3) {
        this.showInverter2 = true;
        this.showInverter3 = true;
        this.toggleInverter2Validaton(true);
        this.toggleInverter3Validaton(true);
        this.updateBomChekbox(2.2, true);
        this.updateBomChekbox(2.3, true);
      }

    })
  }

  /**
   * Update BOM Fields
   */

  // Solar PV Module
  updateBOMSolarPvModuleDesc(rating) {
    return rating +" Wp" + this.panelType+"/"+ this.moduleMaterial +" PV Modules with RIFD tag, IEC -61215, 61730 standard";
  }

  // Update inverter
  updateInverterDesc(capacity, phase, type) {
    if(phase == 1 || phase =='Single Phase') {
      return capacity+" , Single Phase, "+ type +", System output voltage 230 Vac, 50Hz, 1ph 2 Wire";
    } else {
      return capacity+" , Three Phase, "+ type +", System output voltage 400 Vac, 50Hz, 3ph 4 wire";
    }
  }

  // Update Remote Monitoring
  updateRemoteMonitoring(type) {
    return type + " Stick";
  }

  // Update Battery
  updateBatteryDesc(rating) {
    return rating + " 12V C-10 Batteries ";
  }

  // Update MMS
  updateMMS() {
    let tilt;
    let roof;
    let material;
    if(this.sodesignerform) {
      tilt = this.sodesignerform.controls.so_tilt_angle.value;
      roof = this.sodesignerform.controls.so_mounting_structure_type.value;
      material = this.sodesignerform.controls.so_mms.value;
    } else {
      tilt = '10';
      roof = "RCC Roof";
      material = "Hot Dip Galvanised"
    }

    return material + " Module Mounting Structure (MMS) including SS304 grade of hardware, Module lower edge clearance approx. 2 mtrs with fixed tilt  "+ tilt +" degree, Double Potrait 1*(2x3) and 1*(2x5) for "+ roof +". All members shall be min. 100x50x15 mm , and min thickness 2mm, shall be as per IS standards & Industry Norms and should be designed to withstand 180 km/hr wind speed.\n\nMMS legs shall be anchored with mother RCC roof using 4 Nos. 10mmx75mm anchor bolts and Fischer/Hilti chemical for each leg.";
  }

  updateInstallationText() {
    const capacityInKw = (+this.handoff_data.h_data.proposalDetails.proposal_dc_capacity) / 1000
    return "Installation, testing & commissioning of "+ capacityInKw +" kWp ,termination on main Meter & Completion of Grid-tied rooftop solar system  in the premises, complete in all respect including painting of footings, packing/unpacking, handling and forwarding of safely materials. ";
  }

  updateLightingArrestorText() {
    if(this.sodesignerform) {
      if (this.sodesignerform.controls.so_lightingArrester.value == 1) {
        this.annexture2[4].value[3].component = "Franklin Lighting Arrester"
        this.annexture2[4].value[3].description = "Frankline LA with 3.0 meter long supporting post, 16mm mm dia with five spike and base plate made in high grade Aluminium with copper coating  Lightening arrestor."
      } else  {
        this.annexture2[4].value[3].component = "ESE Lighting Arrester"
        this.annexture2[4].value[3].description = "ESE LA with 3.0 meter long supporting post, 50 mm dia with 250mmx250mm GI base plate and 1Cx50 Sqmm copper conductor cable. "
      }
    }
  }

  updateBomDescription(id, newDescription) {
    // Find the object with the matching id in the onGridData array
    const objectToUpdate = this.annexture2.flatMap(({ value }) => value).find((obj) => obj.id === id);

    if (!objectToUpdate) {
      console.error(`Object with id ${id} not found`);
      return;
    }

    // Update the description property of the found object
    objectToUpdate.description = newDescription;
  }

  updateBomQty(id, qty) {
    // Find the object with the matching id in the onGridData array
    const objectToUpdate = this.annexture2.flatMap(({ value }) => value).find((obj) => obj.id === id);

    if (!objectToUpdate) {
      console.error(`Object with id ${id} not found`);
      return;
    }

    // Update the qty property of the found object
    objectToUpdate.qty = qty;
  }

  updateBomChekbox(id, val) {
    // Find the object with the matching id in the onGridData array
    const objectToUpdate = this.annexture2.flatMap(({ value }) => value).find((obj) => obj.id === id);

    if (!objectToUpdate) {
      console.error(`Object with id ${id} not found`);
      return;
    }

    // Update the checked property of the found object
    objectToUpdate.checked = val;
  }


  solutionTypeChanged(event) {

    const val = event.value;

          // reset inverter fields
          this.sodesignerform.controls.so_solarinverter.patchValue('');
          this.sodesignerform.controls.so_solarinverter2.patchValue('');
          this.sodesignerform.controls.so_solarinverter3.patchValue('');
          this.sodesignerform.controls.so_solarinverter_rat.patchValue('');
          this.sodesignerform.controls.so_solarinverter_rat2.patchValue('');
          this.sodesignerform.controls.so_solarinverter_rat3.patchValue('');
          this.sodesignerform.controls.so_solarinverter_qty.patchValue('');
          this.sodesignerform.controls.so_solarinverter_qty2.patchValue('');
          this.sodesignerform.controls.so_solarinverter_qty3.patchValue('');
          this.sodesignerform.controls.so_remote_monitoring.patchValue('');
          this.sodesignerform.controls.so_remote_monitoring_type.patchValue('');
          this.sodesignerform.controls.so_remote_monitoring_qty.patchValue('');
          this.sodesignerform.controls.so_battery.patchValue('');
          this.sodesignerform.controls.so_battery_rating.patchValue('');
          this.sodesignerform.controls.so_battery_qty.patchValue('');
          this.sodesignerform.controls.so_zero_export_device.patchValue('');
          this.sodesignerform.controls.so_zero_export_device_type.patchValue('');
          this.sodesignerform.controls.so_zero_export_device_qty.patchValue('');
          this.sodesignerform.controls.so_ssp_scope.patchValue('');


          console.log(val);

          if(val == 1) {

            this.setOnGridValidators();
            this.annexture2 = this.onGridData;

          }

          if(val == 2) {

            this.setOffGridValidators();
            this.annexture2 = this.offGridData;

          }

          if(val ==3) {

            this.setHybridValidators();
            this.annexture2 = this.hybridData;

          }
          // Update Lighting arrestor
          this.updateLightingArrestorText();
          // Update Installation
          const installationText = this.updateInstallationText();
          this.annexture2[9].value[4].description = installationText;
          this.annexture2[9].value[4].description = installationText;
          this.annexture2[9].value[4].description = installationText;


          // Trigger inverter qty change to update BOM inverter fields
          this.sodesignerform.controls.proposal_inverter_number.patchValue(this.sodesignerform.controls.proposal_inverter_number.value);


  }

  setOnGridValidators() {
    // Remove Validators
    this.sodesignerform.controls.so_battery.clearValidators();
    this.sodesignerform.controls.so_battery_rating.clearValidators();
    this.sodesignerform.controls.so_battery_qty.clearValidators();

    // Add validators
    this.sodesignerform.controls.so_zero_export_device.setValidators([Validators.required]);
    this.sodesignerform.controls.so_zero_export_device_type.setValidators([Validators.required]);
    this.sodesignerform.controls.so_zero_export_device_type.setValidators([Validators.required]);

    this.sodesignerform.controls.so_remote_monitoring.setValidators([Validators.required]);
    this.sodesignerform.controls.so_remote_monitoring_type.setValidators([Validators.required]);
    this.sodesignerform.controls.so_remote_monitoring_qty.setValidators([Validators.required]);


    this.sodesignerform.controls.so_battery.updateValueAndValidity();
    this.sodesignerform.controls.so_battery_rating.updateValueAndValidity();
    this.sodesignerform.controls.so_battery_qty.updateValueAndValidity();

    this.sodesignerform.controls.so_zero_export_device.updateValueAndValidity();
    this.sodesignerform.controls.so_zero_export_device_type.updateValueAndValidity();
    this.sodesignerform.controls.so_zero_export_device_qty.updateValueAndValidity();

    this.sodesignerform.controls.so_remote_monitoring.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring_type.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring_qty.updateValueAndValidity();
  }

  setOffGridValidators() {
    // Remove Validators

    this.sodesignerform.controls.so_zero_export_device.clearValidators();
    this.sodesignerform.controls.so_zero_export_device_type.clearValidators();
    this.sodesignerform.controls.so_zero_export_device_qty.clearValidators();

    this.sodesignerform.controls.so_remote_monitoring.clearValidators();
    this.sodesignerform.controls.so_remote_monitoring_type.clearValidators();
    this.sodesignerform.controls.so_remote_monitoring_qty.clearValidators();

    // Add Validators
    this.sodesignerform.controls.so_battery.setValidators([Validators.required]);
    this.sodesignerform.controls.so_battery_rating.setValidators([Validators.required]);
    this.sodesignerform.controls.so_battery_qty.setValidators([Validators.required]);

    this.sodesignerform.controls.so_zero_export_device.updateValueAndValidity();
    this.sodesignerform.controls.so_zero_export_device_type.updateValueAndValidity();
    this.sodesignerform.controls.so_zero_export_device_qty.updateValueAndValidity();

    this.sodesignerform.controls.so_remote_monitoring.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring_type.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring_qty.updateValueAndValidity();

    this.sodesignerform.controls.so_battery.updateValueAndValidity();
    this.sodesignerform.controls.so_battery_rating.updateValueAndValidity();
    this.sodesignerform.controls.so_battery_qty.updateValueAndValidity();
  }

  setHybridValidators() {
    // Remove Validators
    this.sodesignerform.controls.so_zero_export_device.clearValidators();
    this.sodesignerform.controls.so_zero_export_device_type.clearValidators();
    this.sodesignerform.controls.so_zero_export_device_qty.clearValidators();

    // Add Validators
    this.sodesignerform.controls.so_battery.setValidators([Validators.required]);
    this.sodesignerform.controls.so_battery_rating.setValidators([Validators.required]);
    this.sodesignerform.controls.so_battery_qty.setValidators([Validators.required]);

    this.sodesignerform.controls.so_remote_monitoring.setValidators([Validators.required]);
    this.sodesignerform.controls.so_remote_monitoring_type.setValidators([Validators.required]);
    this.sodesignerform.controls.so_remote_monitoring_qty.setValidators([Validators.required]);

    this.sodesignerform.controls.so_zero_export_device.updateValueAndValidity();
    this.sodesignerform.controls.so_zero_export_device_type.updateValueAndValidity();
    this.sodesignerform.controls.so_zero_export_device_qty.updateValueAndValidity();
    this.sodesignerform.controls.so_battery.updateValueAndValidity();
    this.sodesignerform.controls.so_battery_rating.updateValueAndValidity();
    this.sodesignerform.controls.so_battery_qty.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring_type.updateValueAndValidity();
    this.sodesignerform.controls.so_remote_monitoring_qty.updateValueAndValidity();
  }

  // randm 4 digit number
  randomNumber() {
    this.randomParam = Math.floor(Math.random() * 10000 + 1);
  }

  confirm() {
    this.confirmationService.confirm({
      message: "Are you sure that you want cancel?",
      accept: () => {
        this.isListing = "lead-list";
        this.showSmartSearchComponent = true;
      },
    });
  }

  /**
   * Submit supply order form
   */
  submitSoform() {
    this.submitted = true;
    this.sodesignerform.value;
    //console.log(this.sodesignerform.value);
    if (this.sodesignerform.valid) {
      this.actionLoader = "fillKart_loader";
      this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
      this.subscription = this.projectManagementService
        .SaveSupplyOrderData(this.sodesignerform.value)
        .subscribe((data) => {
          if (data.status == 1) {
            this.popupMessageService.showSuccess(
              "Supply order submitted successfully.",
              "success"
            );
            this.supplyOrderCount = this.supplyOrderCount + 1;
            this.supplyOrderFilePaths = [];
            this.generatePdfLinks();
            this.showSoDraft = false;
          } else {
            this.popupMessageService.showError(data.error_message, "Error!");
          }
          this.actionLoader = "";
          this.submitted = false;
        });
    } else {
      this.popupMessageService.showError(
        "Please fill the required fields",
        "Error!"
      );
        this.getFormValidationErrors()
    }
  }

  getFormValidationErrors() {
    Object.keys(this.sodesignerform.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.sodesignerform.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
         console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  toggleVisibility(e) {
    if (e.target.checked) {
      this.sodesignerform.controls.so_fname.setValue(
        this.handoff_data.h_data.cceLeaddata.cceld_firstname
      );
      this.sodesignerform.controls.so_lname.setValue(
        this.handoff_data.h_data.cceLeaddata.cceld_lastname
      );
      this.sodesignerform.controls.so_mobileno.setValue(
        this.handoff_data.h_data.cceLeaddata.cceld_mobileno
      );
      this.sodesignerform.controls.so_email.setValue(
        this.handoff_data.h_data.cceLeaddata.cceld_email
      );
      const address = this.handoff_data.h_data.cceLeaddata.cceld_address1 + ' ' + this.handoff_data.h_data.cceLeaddata.cceld_address2 + ' ' + this.handoff_data.h_data.district_name + ' ' + this.handoff_data.h_data.state_name + '-' + this.handoff_data.h_data.cceLeaddata.cceld_pincode;
      //console.log(address);

      this.sodesignerform.controls.so_address.setValue(
        // this.handoff_data.h_data.cceLeaddata.cceld_address1
        address
      );
      this.sodesignerform.controls.so_gst.setValue(
        this.handoff_data.h_data.consumer.consumer_gst
      );
      this.sodesignerform.controls.so_is_billing_shipping_same.patchValue(1);
    } else {
      this.sodesignerform.controls.so_fname.setValue("");
      this.sodesignerform.controls.so_lname.setValue("");
      this.sodesignerform.controls.so_mobileno.setValue("");
      this.sodesignerform.controls.so_address.setValue("");
      this.sodesignerform.controls.so_email.setValue("");
      this.sodesignerform.controls.so_gst.setValue("");
      this.sodesignerform.controls.so_is_billing_shipping_same.patchValue(0);
    }
  }

  getpartnerListArray() {
    this.subscription = this.leadListService
      .getPartnerDataByRole(24)
      .subscribe((data) => {
        if (data.status) {
          if (data.data.length <= 0) {
            this.partnerList;
          } else {
            for (let item of data.data) {
              // if (item.psm_is_reopen_or_rejected != 1){
              //this.partnerList = [];
              this.partnerList.push({
                value: String(item.emp_id),
                label: String(item.emp_firstname),
                state: item.emp_state
              });
              // }
            }
          }
        }
        this.getSupplyOrderDetails();
      });
  }

  getLeadList_actionable() {
    this.loader = true;
    this.record = false;
    this.sharedServices.searchForm.next("supplyOrder");
    this.showSmartSearchComponent = true;
    this.isListing = "lead-list";
    this.isPaymentList = false;
    if (localStorage.getItem("emp_auth_key")) {
      this.isListing = "lead-list";
      let actinabl_list = [];
      this.subscription = this.leadListService
        .getSupplyOrderList()
        .subscribe((data) => {
          if (data.status) {
            let hdata = "";
            data.result.forEach(function (value: any) {
              hdata = JSON.parse(value.handOff.h_data);
              value.handOff.h_data = hdata[0];
              actinabl_list.push(value);
            });
            this.actionable_lst = actinabl_list;
          } else {
            this.actionable_lst = actinabl_list;
          }
          this.loader = false;
        });
    } else {
      this.loader = false;
      this.route.navigateByUrl("/employee/login");
    }
  }

  showTabData(step: number) {
    this.panelSteps = step;
  }

  generatePdfLinks() {

    let path = '';
    let fileName = '';

      for( let i = this.supplyOrderCount - 1; i >= 0; i--) {
        if(i == 0) {
          const revisionNumber = '';

          const name = (this.handoff_data.h_data.cceLeaddata.cceld_firstname).replace(/[^a-zA-Z0-9\s.]/g, '_')+'-'+(this.handoff_data.h_data.cceLeaddata.cceld_lastname).replace(/[^a-zA-Z0-9\s.]/g, '_');

          const dcCapacity = (+this.handoff_data.h_data.proposalDetails.proposal_dc_capacity) / 1000

          path = this.baseurl + '/public/uploads/' + this.handoff_data.h_projectid + '/supply_order/' + name + '-'+ dcCapacity + 'kWp' +'.pdf';

          fileName = name + '-'+ dcCapacity + 'kWp';
        } else {
          const revisionNumber = i;

          const name = (this.handoff_data.h_data.cceLeaddata.cceld_firstname).replace(/[^a-zA-Z0-9\s.]/g, '_')+'-'+(this.handoff_data.h_data.cceLeaddata.cceld_lastname).replace(/[^a-zA-Z0-9\s.]/g, '_');

          const dcCapacity = (+this.handoff_data.h_data.proposalDetails.proposal_dc_capacity) / 1000

          path = this.baseurl + '/public/uploads/' + this.handoff_data.h_projectid + '/supply_order/' + revisionNumber + '-' + name + '-'+ dcCapacity + 'kWp'+'.pdf';

          fileName = revisionNumber + '-' + name + '-'+ dcCapacity + 'kWp';
        }
        this.supplyOrderFilePaths.push({path, fileName});
      }

  }

  submitLeadSearch() {
    this.isLeadSearchFormSubmitted = true;
    this.unprocessedLeads = [];
    if (this.searchLeadForm.valid) {
      this.subscription = this.leadListService
        .searchLead(this.searchLeadForm.value)
        .subscribe(
          (data) => {
            if (data.status) {
              this.unprocessedLeads = data.result.data;

              if (this.unprocessedLeads.length > 0) {
                this.popupMessageService.showSuccess(
                  "Data Listed Successfully!",
                  "Success"
                );
              } else {
                this.popupMessageService.showInfo("No Data Found", "Info");
              }
            } else {
              this.popupMessageService.showError(data.error_message, "Error!");
            }
          },
          (error) => {
            this.popupMessageService.showError("Server Error.", "Error!");
          }
        );
    }
  }

  smartSearchResults(event) {
    let actinabl_list = [];
    if (event.status) {
      let hdata = "";
      event.result.forEach(function (value: any) {
        hdata = JSON.parse(value.handOff.h_data);
        value.handOff.h_data = hdata[0];
        actinabl_list.push(value);
      });

      this.actionable_lst = actinabl_list;
    } else {
      this.actionable_lst = actinabl_list;
    }
  }

  ViewHandoffDetails(handoff: any) {
    if (localStorage.getItem("emp_auth_key")) {
      this.isListing = "";
      this.panelSteps = 1;
      this.showSmartSearchComponent = false;
      this.handoff_data = handoff;
      if(this.handoff_data.h_data.proposalDetails.proposal_solution_type == 1) {
        this.annexture2 = this.onGridData;
      } else if(this.handoff_data.h_data.proposalDetails.proposal_solution_type == 2) {
        this.annexture2 = this.offGridData;
      } else {
        this.annexture2 = this.hybridData;
      }
      this.setInitialBOMValuesFromProposal();
      this.createSOForm(this.handoff_data.h_projectid);
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  onChangeItem(event, i, j) {
    if (event.target.checked) {
      this.annexture2[i].value[j].checked = true;
    } else {
      this.annexture2[i].value[j].checked = false;
    }
    this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
  }

  onBlur(data, component) {}

  getInverterRatingType() {
    const solutionType = this.sodesignerform.controls.so_solution_type.value;
    // const connectionType =
    //   this.sodesignerform.controls.so_connection_type.value;
    // if (!solutionType || !connectionType) {
    //   return;
    // }
    // if (solutionType == 1 && connectionType == 1) {
    //   return this.solarInverterOngrid1PhRating;
    // }
    // if (solutionType == 1 && connectionType == 3) {
    //   return this.solarInverterOngrid3PhRating;
    // }
    // if (
    //   (solutionType == 2 || solutionType == 3) &&
    //   (connectionType == 1 || connectionType == 3)
    // ) {
    //   return this.solarInverterOffGridHybridRating;
    // }
    if(solutionType == 1) {
      return this.solarInverterOngrid;
    } else if(solutionType == 2) {
      return this.solarInverterOffGrid;
    } else {
      return this.solarInverterHybrid;
    }
  }

  getRemoteMonitoringType() {
    const solutionType = this.sodesignerform.controls.so_solution_type.value;
    if(solutionType == 1) {
      return this.remoteMonitoringSystemTypeOngrid;
    } else if(solutionType == 3) {
      return this.remoteMonitoringSystemTypeHybrid;
    } else {
      return;
    }
  }

  getSspScope() {
    let solarPvModuleValue = +this.sodesignerform.controls.so_solarpv.value || 0;
    let solarInverterValue1 = +this.sodesignerform.controls.so_solarinverter.value || 0;
    let solarInverterValue2 = +this.sodesignerform.controls.so_solarinverter.value || 0;
    let solarInverterValue3 = +this.sodesignerform.controls.so_solarinverter.value || 0;
    let solarInverterValue = solarInverterValue1 + solarInverterValue2 + solarInverterValue3;
    let remoteMonitoringValue = +this.sodesignerform.controls.so_remote_monitoring.value || 0;
    let soPlatformValue = +this.sodesignerform.controls.so_platform.value || 0;
    let soZeroExportDeviceValue = +this.sodesignerform.controls.so_zero_export_device.value || 0;
    let projectValueIncGST;
    if (this.handoff_data.plan_selected == 1) {
      // For Gold
        projectValueIncGST =
          this.handoff_data.h_data.proposalDetails.proposal_project_value_gold -
          this.handoff_data.h_data.proposalDetails.discount;
      } else {
      // For Silver
        projectValueIncGST =
          this.handoff_data.h_data.proposalDetails
            .proposal_project_value_silver -
          this.handoff_data.h_data.proposalDetails.discount_silver;
      }
    const sspScope = projectValueIncGST - (solarPvModuleValue + solarInverterValue + remoteMonitoringValue + soPlatformValue + soZeroExportDeviceValue);

    this.sodesignerform.controls.so_ssp_scope.patchValue(sspScope);
  }

  sendSupplyOrderEmail() {
    const data = {
      projectId: this.handoff_data.h_projectid,
      surveyorId: this.handoff_data.h_data.consumerProject.project_surveyor,
      prjMngrId: this.handoff_data.h_prj_manager,
    };
    this.actionLoader = "fillKart_loader";
    this.leadListService.sendSupplyOrderMail(data).subscribe(
      (res) => {
        if (res.status) {
          this.actionLoader = "";
          this.popupMessageService.showSuccess(
            "Mail Sent Successfully!",
            "Success"
          );
        }
      },
      (err) => {
        this.actionLoader = "";
        this.popupMessageService.showError("Mail nor Sent!", "Error");
      }
    );
  }

  resetSoFiles() {
    this.supplyOrderFilePaths=[];
    this.supplyOrderCount = 0;
    this.partnerList = [];
    this.showSoDraft = true;
  }

  get getSolutionType() {
    return this.sodesignerform.controls.so_solution_type.value;
  }

  imageDocsIssues: string = "";
  isUploadingDocs: boolean = false;
  fileChange(event: any, pid: Number) {
    if (localStorage.getItem("emp_auth_key")) {
      const documentType = "";
      this.actionLoader = "upload_loader";
      let eventClone = event;
      let extType = event.target.files[0].type;
      let ext = eventClone.target.files[0].name.split(".").pop();
      let name = eventClone.target.files[0].name.replace(/\//g,"-");
      const empData = JSON.parse(localStorage.getItem('userData'));
      const empId = empData.emp_id;
      this.sharedServices
        .docsToBase64(event, [
          "pdf",
          "PDF"
        ])
        .then(data => {
          this.imageDocsIssues = "";
          this.isUploadingDocs = true;
          this.sharedServices
            .uploadSupplyOrderDoc({
              'pdoc_projecitid':pid,
              'pdoc_filename': 'so_additional_docs',
              'file':String(data),
              'extension':ext,
              'extension_type':extType,
              'file_name':name,
              'pdoc_roleid': localStorage.getItem('role_id'),
              'pdoc_createdby': empId
            }
            )
            .subscribe(
              data => {
                if (data.status == 1) {

                  this.uploadDocument.reset();

                  this.popupMessageService.showSuccess(
                    "File Uploaded Successfully",
                    "Success!"
                  );
                  this.actionLoader = "";
                  this.getUploadedDocuments()
                } else if (data.error_code != 0) {
                  this.uploadDocument.reset();
                  this.popupMessageService.showError(
                    data.error_message,
                    "Error!"
                  );
                  this.actionLoader = "";

                }
              },
              error => {
                this.popupMessageService.showError(
                  "Error in file upload.",
                  "Upload Error!"
                );
                this.actionLoader = "";
              }
            );
        })
        .catch(data => {
          this.actionLoader = "";
          this.popupMessageService.showError(data, "Invalid File Type!");
          //this.alertService.error(data);
        });
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  /**
   * @description: function handled file dropped as event and serve as same in file change event of form using
   */
   handleFilesDropped(event: any) {
    let eventAsSelectfile = { target: { files: event } };
    let pid = this.handoff_data.h_projectid;
    this.fileChange(eventAsSelectfile, pid);
  }

  getUploadedDocuments() {
    if (localStorage.getItem("emp_auth_key")) {
      this.actionLoader = "uploadedDocs_loader";
      this.leadListService
        .getUploadedDocuments(this.handoff_data.h_projectid, localStorage.getItem("role_id"), "so_additional_docs")
        .subscribe(
          data => {
            if (data.status == 1) {
              this.projectDocuments = data.data;
              if(this.projectDocuments) {
                this.projectDocuments.map(item => {
                  const arr = item.pdoc_filename.split("/");
                  let name = arr[4];
                  name = this.removeFileExtension(name)
                  return item.displayName = name;
                })
              }
              this.actionLoader = "";
            }
          },
          error => {
            this.popupMessageService.showError("Some Error.", "Error!");
            this.actionLoader = "";
          }
        );
    } else {
      this.route.navigateByUrl("/employee/login");
    }
  }

  removeFileExtension(fileName) {
    // Split the file name into an array of parts delimited by a period
    const parts = fileName.split('.');

    // Remove the last element of the array (the file extension)
    const extension = parts.pop();

    // Join the array back into a string
    return parts.join('.');
  }

  saveDraft() {
    this.sodesignerform.controls.so_bom.patchValue(this.annexture2);
    const formData = this.sodesignerform.value;
    const formString =  JSON.stringify(formData);
    //console.log(formString);
    const data = {
      so_project_id: this.handoff_data.h_projectid,
      draft: formString
    };
    this.projectManagementService.SaveSupplyOrderDraft(data).subscribe(
      res => {
      if(res.status) {
        this.popupMessageService.showSuccess("Draft Saved Successfully", "Success");
      } else {
        this.popupMessageService.showError("Can't save draft", "Error");
      }
    },
      err => {
        this.popupMessageService.showError("Can't save draft", "Error");
      }
    );

  }

  toggleInverter2Validaton(val: boolean) {
   // console.log("toggleInverter2Validaton", val);
    if(val) {
      // Add validators to Inverter 2
      //console.log("c");

      this.sodesignerform.controls.so_solarinverter2.setValidators([Validators.required]);
      this.sodesignerform.controls.so_solarinverter_rat2.setValidators([Validators.required]);
      this.sodesignerform.controls.so_solarinverter_qty2.setValidators([Validators.required]);
    } else {
      // Remove validators and clear values
      //console.log("d");

      this.sodesignerform.controls.so_solarinverter2.clearValidators();
      this.sodesignerform.controls.so_solarinverter_rat2.clearValidators();
      this.sodesignerform.controls.so_solarinverter_qty2.clearValidators();
      this.sodesignerform.controls.so_solarinverter2.patchValue("");
      this.sodesignerform.controls.so_solarinverter_rat2.patchValue("");
      this.sodesignerform.controls.so_solarinverter_qty2.patchValue("");
    }
  }

  toggleInverter3Validaton(val: boolean) {
    console.log("toggleInverter3Validaton", val);
    if(val) {
      // Add validators to Inverter 2
      //console.log("a");
      this.sodesignerform.controls.so_solarinverter3.setValidators([Validators.required]);
      this.sodesignerform.controls.so_solarinverter_rat3.setValidators([Validators.required]);
      this.sodesignerform.controls.so_solarinverter_qty3.setValidators([Validators.required]);
    } else {
      // Remove validators and clear values
      //console.log("b");
      this.sodesignerform.controls.so_solarinverter3.clearValidators();
      this.sodesignerform.controls.so_solarinverter_rat3.clearValidators();
      this.sodesignerform.controls.so_solarinverter_qty3.clearValidators();
      this.sodesignerform.controls.so_solarinverter3.patchValue("");
      this.sodesignerform.controls.so_solarinverter_rat3.patchValue("");
      this.sodesignerform.controls.so_solarinverter_qty3.patchValue("");

    }
  }

}
