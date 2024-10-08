import { computed, reactive } from 'vue'
import { createResource } from 'frappe-ui'
import router from '@/router'

export function sessionUser() {
	let cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
	let _sessionUser = cookies.get('user_id')
	if (_sessionUser === 'Guest') {
		_sessionUser = null
	}
	return _sessionUser
}

export let session = reactive({
	login: createResource({
		url: 'login',
		method: 'POST',
		makeParams({ email, password }) {
			return {
				usr: email,
				pwd: password,
			}
		},
		onSuccess(data) {
			session.user = sessionUser()
			session.login.reset()
			router.replace(data.default_route || '/')
		},
	}),
	logout: createResource({
		url: 'logout',
		method: 'POST',
		onSuccess() {
			session.user = sessionUser()
			router.replace({ name: 'Login' })
		},
	}),
	user: sessionUser(),
	isLoggedIn: computed(() => !!session.user),
})
