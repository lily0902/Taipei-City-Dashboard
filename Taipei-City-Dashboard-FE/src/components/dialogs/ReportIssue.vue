<!-- ReportIssue.vue -->
<script setup>
import { ref, computed } from "vue";
import { useDialogStore } from "../../store/dialogStore";
import { useAuthStore } from "../../store/authStore";
import { useContentStore } from "../../store/contentStore";
import http from "../../router/axios";
import DialogContainer from "./DialogContainer.vue";

const dialogStore = useDialogStore();
const authStore = useAuthStore();
const contentStore = useContentStore();

const allInputs = ref({
	type: "組件基本資訊有誤",
	description: "",
	title: "",
});

const issueTypes = [
	"組件基本資訊有誤",
	"組件資料有誤或未更新",
	"系統問題",
	"其他建議",
];

const issueTypes2 = ["酒店", "餐廳", "夜店", "KTV"];

const currentDialog = computed(() => {
	if (dialogStore.dialogs.reportIssueType1) return "reportIssueType1";
	if (dialogStore.dialogs.reportIssueType2) return "reportIssueType2";
	if (dialogStore.dialogs.reportIssueType3) return "reportIssueType3";
	return "reportIssue";
});

async function handleSubmit() {
	const submitObject = {
		title: allInputs.value.title,
		description: allInputs.value.description,
		user_name: authStore.user.name,
		user_id: `${authStore.user.user_id}`,
		context: `類型：${allInputs.value.type} // 來源：${dialogStore.issue.id} - ${dialogStore.issue.index} - ${dialogStore.issue.name}`,
		status: "待處理",
	};
	await http.post(`/issue/`, submitObject);
	dialogStore.showNotification("success", "回報問題成功，感謝您的建議");
	contentStore.loading = false;
	handleClose();
}

function handleClose() {
	allInputs.value = {
		type: "組件基本資訊有誤",
		description: "",
		title: "",
	};
	dialogStore.hideAllDialogs();
}
</script>

<template>
	<DialogContainer :dialog="currentDialog" @on-close="handleClose">
		<div class="reportissue">
			<!--一個template一個組件要顯示的回報內容-->
			<template v-if="currentDialog === 'reportIssueType1'">
				<h2>警示高風險區域</h2>
				<!--第一個問題及選項-->
				<h3>地址* ({{ allInputs.title.length }}/20)</h3>
				<input
					v-model="allInputs.title"
					class="reportissue-input"
					type="text"
					:minLength="1"
					:maxLength="20"
					required
				/>
				<!--問題種類標題及選項-->
				<h3>場所*</h3>
				<div v-for="item in issueTypes2" :key="item">
					<input
						:id="item"
						v-model="allInputs.type"
						class="reportissue-radio"
						type="radio"
						:value="item"
					/>
					<label :for="item">
						<div />
						{{ item }}
					</label>
				</div>
				<!--問題簡述標題及文字框-->
				<h3>問題簡述* ({{ allInputs.description.length }}/200)</h3>
				<textarea
					v-model="allInputs.description"
					:minLength="1"
					:maxLength="200"
					required
				/>
				<!-- Type 1 specific content -->
			</template>
			<template v-else-if="currentDialog === 'reportIssueType2'">
				<h2>新增地點 - Type 2</h2>
				<!-- Type 2 specific content -->
			</template>
			<template v-else-if="currentDialog === 'reportIssueType3'">
				<h2>警察回報給代駕</h2>
				<h3>人數* ({{ allInputs.title.length }}/20)</h3>
				<input
					v-model="allInputs.title"
					class="reportissue-input"
					type="text"
					:minLength="1"
					:maxLength="20"
					required
				/>
				<h3>場所*</h3>
				<div v-for="item in issueTypes2" :key="item">
					<input
						:id="item"
						v-model="allInputs.type"
						class="reportissue-radio"
						type="radio"
						:value="item"
					/>
					<label :for="item">
						<div />
						{{ item }}
					</label>
				</div>
				<!--問題簡述標題及文字框-->
				<h3>場所名稱* ({{ allInputs.description.length }}/200)</h3>
				<textarea
					v-model="allInputs.description"
					:minLength="1"
					:maxLength="200"
					required
				/>
				<!-- Type 3 specific content -->
			</template>

			<!--下面都一樣不用動-->
			<div class="reportissue-control">
				<button class="reportissue-control-cancel" @click="handleClose">
					取消
				</button>
				<button
					v-if="allInputs.description && allInputs.title"
					class="reportissue-control-confirm"
					@click="handleSubmit"
				>
					回報問題
				</button>
			</div>
		</div>
	</DialogContainer>
</template>

<style scoped lang="scss">
.reportissue {
	width: 300px;
	display: flex;
	flex-direction: column;

	h3 {
		margin: 0.5rem 0;
		font-size: var(--font-s);
		font-weight: 400;
	}

	&-radio {
		display: none;

		&:checked + label {
			color: white;

			div {
				background-color: var(--color-highlight);
			}
		}

		&:hover + label {
			color: var(--color-highlight);

			div {
				border-color: var(--color-highlight);
			}
		}
	}

	label {
		position: relative;
		display: flex;
		align-items: center;
		font-size: var(--font-s);
		color: var(--color-complement-text);
		transition: color 0.2s;
		cursor: pointer;

		div {
			width: calc(var(--font-s) / 2);
			height: calc(var(--font-s) / 2);
			margin-right: 4px;
			padding: calc(var(--font-s) / 4);
			border-radius: 50%;
			border: 1px solid var(--color-border);
			transition: background-color 0.2s, border-color 0.2s;
		}
	}

	&-control {
		display: flex;
		justify-content: flex-end;
		margin-top: var(--font-ms);

		&-cancel {
			margin: 0 2px;
			padding: 4px 6px;
			border-radius: 5px;
			transition: color 0.2s;

			&:hover {
				color: var(--color-highlight);
			}
		}

		&-confirm {
			margin: 0 2px;
			padding: 4px 10px;
			border-radius: 5px;
			background-color: var(--color-highlight);
			transition: opacity 0.2s;

			&:hover {
				opacity: 0.8;
			}
		}
	}
}
</style>
