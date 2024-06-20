import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
	state: () => ({
		dialogs: {
			// Admin Dialogs: /components/dialogs/admin
			adminComponentSettings: false,
			adminAddEditDashboards: false,
			adminEditIssue: false,
			adminAddComponent: false,
			adminDeleteDashboard: false,
			adminEditUser: false,
			adminAddEditContributor: false,
			adminDeleteContributor: false,
			// Public Dialogs: /components/dialogs
			addComponent: false,
			addDashboard: false,
			dashboardSettings: false,
			addEditDashboards: false,
			initialWarning: false,
			login: false,
			mobileLayers: false,
			mobileNavigation: false,
			moreInfo: false,
			notificationBar: false,
			reportIssue: false,
			reportIssueType1: false, // 新增
			reportIssueType2: false, // 新增
			reportIssueType3: false, // 新增
			userSettings: false,
			embedComponent: false,
			contributorsList: false,
			contributorInfo: false,
		},
		// Stores the content for notifications
		notification: {
			status: "",
			message: "",
		},
		// Stores the content for report issue dialogs
		issue: {
			id: null,
			index: null,
			name: "",
		},
		// Stores the content for more info dialogs
		moreInfoContent: null,
		// Stores Edit or Add mode for addeditdashboards dialog
		addEdit: "",
	}),
	getters: {},
	actions: {
		// Show the dialog passed into the function
		showDialog(dialog) {
			this.dialogs[dialog] = true;
		},
		// Will hide all dialogs currently active
		hideAllDialogs() {
			const keys = Object.keys(this.dialogs);
			for (let i = 0; i < keys.length; i++) {
				if (keys[i] === "notificationBar") {
					continue;
				}
				this.dialogs[keys[i]] = false;
			}
			this.moreInfoContent = null;
		},
		// Show the notification bar and update the notification message
		showNotification(status, message) {
			this.showDialog("notificationBar");
			this.notification = {
				status: status, // success, fail, info
				message: message,
			};
			setTimeout(() => {
				this.dialogs.notificationBar = false;
			}, 3000);
		},
		// Show the more info dialog and update the content
		showMoreInfo(content) {
			this.showDialog("moreInfo");
			this.moreInfoContent = content;
		},
		// Show the report issue dialog and enter the id and name of the component of origin
		showReportIssue(id, index, name) {
			if (id === 69) {
				this.showDialog("reportIssueType1");
			} else if (id === 79) {
				this.showDialog("reportIssueType2");
			} else if (id === 80) {
				this.showDialog("reportIssueType3");
			} else {
				this.showDialog("reportIssue");
			}
			this.issue = {
				id: id,
				index: index,
				name: name,
			};
		},
	},
});
