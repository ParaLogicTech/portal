import { io } from 'socket.io-client'
import { socketio_port } from '../../../../sites/common_site_config.json'
import { getCachedListResource } from 'frappe-ui/src/resources/listResource'
import { getCachedResource } from 'frappe-ui/src/resources/resources'

export function initSocket() {
	let host = window.location.hostname
	let port = window.location.port ? `:${socketio_port}` : ''
	let protocol = port ? 'http' : 'https'
	let url = `${protocol}://${host}${port}/`

	let socket = io(url, {
		withCredentials: true,
		reconnectionAttempts: 5,
	})

	socket.on('refetch_resource', (data) => {
		if (data.cache_key) {
			let resource =
				getCachedResource(data.cache_key) ||
				getCachedListResource(data.cache_key)
			if (resource) {
				resource.reload()
			}
		}
	})
	return socket
}

export function on_doctype_list_update(socket, doctype, callback) {
	subscribe_doctype(socket, doctype)
	socket.on('list_update', (data) => {
		if (data.doctype == doctype) {
			callback(data.name)
		}
	})
}

const doctypes_subscribed = {};

export function subscribe_doctype(socket, doctype) {
	if (doctypes_subscribed[doctype]) {
		return;
	}
	socket.emit('doctype_subscribe', doctype)
	doctypes_subscribed[doctype] = true
}

const docs_subscribed = {};

export function subscribe_doc(socket, doctype, name) {
	if (docs_subscribed[`${doctype}:${name}`]) {
		return;
	}
	socket.emit('doc_subscribe', doctype, name);
	docs_subscribed[`${doctype}:${name}`] = true;
}

export function unsubscribe_doc(socket, doctype, name) {
	socket.emit('doc_unsubscribe', doctype, name);
	delete docs_subscribed[`${doctype}:${name}`];
}
