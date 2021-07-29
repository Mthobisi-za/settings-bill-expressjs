var settingsBill = require("../settings-bill");
var assert = require('assert');
var moment = require("moment");
moment().format()

describe("Settings Bill", ()=>{
    var data = {
        smsCost: 2,
        callCost: 4,
        warningLevel: 20,
        criticalLevel: 30
     }
    it("should be able to set the settings",()=>{
        var bill = settingsBill()
        assert.deepEqual(bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         }), undefined)
    });
    it("Should be able to get the settings", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         })
         assert.deepEqual(bill.getSettings(), data)
    });
    it("Should record an action", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         assert.equal(bill.recordAction("call"), undefined)
    });
    it("Should get the record list", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         bill.recordAction("sms");
         var localData = {
            type: "sms",
            cost: 2,
            timestamp: new Date()
         }
         assert.equal(bill.actions(), undefined)
    });

     it("Should get filtered actions for sms", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         bill.recordAction("sms");
         var localData = {
            type: "sms",
            cost: 2,
            timestamp: new Date()
         };
          bill.actions()
         assert.deepEqual(bill.actionsFor("sms"),  [localData])
    });
    it("Should get filtered actions for call", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         bill.recordAction("call");
         var localData = {
            type: "call",
            cost: 4,
            timestamp: new Date()
         };
         bill.actions()
         assert.deepEqual(bill.actionsFor("call"),  [localData])
    });
    it("Should get the total", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         bill.recordAction("sms");
         var localData = {
            type: "sms",
            cost: 2,
            timestamp: new Date()
         };
         bill.actions();
         bill.actionsFor("sms");
         
         assert.deepEqual(bill.totals(), {
            callTotal: 0,
            grandTotal: 2,
            smsTotal: 2
          })
    });
    it("Should check the warning level", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         bill.recordAction("sms");
         var localData = {
            type: "sms",
            cost: 2,
            timestamp: new Date()
         };
         bill.actions();
         bill.actionsFor("sms");
         bill.totals()
         assert.equal(bill.hasReachedWarningLevel(), false)
    });
    it("Should check the critical level", ()=>{
        var bill = settingsBill();
        bill.setSettings({
            smsCost: 2,
            callCost: 4,
            warningLevel: 20,
            criticalLevel: 30
         });
         bill.getSettings();
         bill.recordAction("sms");
         var localData = {
            type: "sms",
            cost: 2,
            timestamp: new Date()
         };
         bill.actions();
         bill.actionsFor("sms");
         bill.totals()
         assert.equal(bill.hasReachedCriticalLevel(), false)
    });
})