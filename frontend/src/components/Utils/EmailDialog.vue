<template>
	<Dialog
		v-model="model"
		:options="{
			title: 'Email',
			size: 'xl',
			loading: true,
			actions: [
				{
					label: 'Send',
					variant: 'solid',
					theme: 'blue',
					onClick: () => this.send_email(),
					loadingText: 'Sending',
				},
			],
		}"
	>
		<template #body-content>
			<div class="form">
				<FormControl
					v-if="settings.is_system_user"
					class="col-row"
					type="email"
					label="To"
					v-model="email_address"
					variant="subtle"
				/>
				<div v-else class="col-row space-y-1.5">
					<label>To</label>
					<Autocomplete
						:options="allowed_recipient_options"
						v-model="recipient"
						placeholder="Recipient"
						variant="outline"
					/>
				</div>

				<FormControl
					class="col-row"
					type="text"
					label="Subject"
					v-model="email_subject"
					variant="subtle"
					:disabled="message_read_only"
				/>

				<div class="col-row space-y-1.5">
					<label>Message</label>
					<div>
						<QuillEditor
							v-model:content="email_message"
							theme="snow"
							content-type="html"
							ref="editor"
							@blur="update_email_message"
							:read-only="message_read_only"
						/>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script>
import {FormControl, Autocomplete} from "frappe-ui";
import {QuillEditor} from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {createAlert} from "@/utils/alerts";
import {settings} from "@/data/settings";
import {session} from "@/data/session";
import CustomerSelection from "@/components/Customer/CustomerSelection.vue";

export default {
	name: "EmailDialog",

	components: {CustomerSelection, Autocomplete, FormControl, QuillEditor},

	props: {
		modelValue: Boolean,
		doc: Object,
		email_template: String,
		default_recipient: String,
	},

	data() {
		return {
			recipient: null,
			email_subject: "",
			email_message: "",
			sending: false,
			settings: settings,
		}
	},

	methods: {
		update_email_message() {
			this.email_message = this.$refs.editor.getHTML();
		},

		set_default_recipient() {
			let default_recipient = this.default_recipient;
			if (!default_recipient && !settings.value.is_system_user) {
				default_recipient = session.user;
			}

			if (!this.email_address && default_recipient) {
				this.email_address = default_recipient;
			}
		},

		async set_email_template(force) {
			if (!this.model || !this.email_template || !this.doc || !Object.keys(this.doc).length) {
				return;
			}

			if (!force && (this.email_subject || this.email_message)) {
				return;
			}

			try {
				await this.email_template_resource.fetch();
				if (this.email_template_resource.data) {
					this.email_subject = this.email_template_resource.data.subject || "";
					this.$refs.editor.pasteHTML(this.email_template_resource.data.message || "", "api");
				}
			} catch (e) { }
		},

		async send_email() {
			try {
				this.sending = true;
				await this.send_email_resource.fetch();
				this.model = false;
			} catch (e) {
				createAlert({"title": "Error Sending Email", "message": e, "variant": "error"});
			} finally {
				this.sending = false;
			}
		},
	},

	computed: {
		model: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit('update:modelValue', value);
			},
		},

		email_address: {
			get() {
				return this.recipient?.value || "";
			},
			set(value) {
				if (value) {
					this.recipient = {label: value, value: value};
				} else {
					this.recipient = null;
				}
			},
		},

		message_read_only() {
			if (settings.value.is_system_user) {
				return false;
			} else {
				return !!this.email_template;
			}
		},

		allowed_recipient_options() {
			return this.allowed_recipients.map(r => {
				return {label: r, value: r};
			});
		},

		allowed_recipients() {
			let allowed = [];
			if (this.default_recipient) {
				allowed.push(this.default_recipient);
			}
			if (session.user && !allowed.includes(session.user)) {
				allowed.push(session.user);
			}
			return allowed;
		},

		email_template_resource() {
			return this.$resources.get_email_template;
		},

		send_email_resource() {
			return this.$resources.send_sales_order_email;
		},
	},

	resources: {
		get_email_template() {
			return {
				url: 'frappe.email.doctype.email_template.email_template.get_email_template',
				method: 'POST',  // use POST because GET is limited in param size
				makeParams() {
					return {
						template_name: this.email_template,
						doc: JSON.stringify(this.doc || {}),
					}
				},
			}
		},

		send_sales_order_email() {
			return {
				url: 'portal.sales_portal.api.orders.send_sales_order_email',
				method: 'POST',
				makeParams() {
					this.update_email_message();
					return {
						name: this.doc.name,
						recipient: this.email_address,
						subject: this.email_subject,
						message: this.email_message,
					}
				},
				onSuccess(data) {
					createAlert({
						"title": "Email Sent",
						"message": `Email successfully sent to ${data}`,
						"variant": "success"
					});
				}
			}
		}
	},

	watch: {
		model: {
			handler(value) {
				if (value) {
					this.set_default_recipient();
					this.set_email_template();
				}
			},
		}
	}
}
</script>
