import { io } from 'socket.io-client'
import { socketio_port } from '../../../../sites/common_site_config.json'
import { getCachedListResource } from 'frappe-ui/src/resources/listResource'
import { getCachedResource } from 'frappe-ui/src/resources/resources'

const doctypes_subscribed = new Set();
const docs_subscribed = {};

export function initSocket() {
	let host = window.location.hostname
	let port = window.location.port ? `:${socketio_port}` : ''
	let protocol = port ? 'http' : 'https'
	let url = `${protocol}://${host}${port}/`

	let socket = io(url, {
		withCredentials: true,
		reconnectionAttempts: 5,
	})

	setup_reconnect(socket);
	setup_global_events(socket);

	return socket
}

function setup_reconnect(socket) {
	socket.on('connect', () => {
		for (let doctype of doctypes_subscribed.values()) {
			subscribe_doctype(socket, doctype, true);
		}

		for (let [doctype, docnames] of Object.entries(docs_subscribed)) {
			for (let name of docnames.values()) {
				subscribe_doc(socket, doctype, name, true);
			}
		}
	});
}

function setup_global_events(socket) {
	socket.on('refetch_resource', (data) => {
		if (data.cache_key) {
			let resource =
				getCachedResource(data.cache_key) ||
				getCachedListResource(data.cache_key)
			if (resource) {
				resource.reload()
			}
		}
	});
}

export function on_doctype_list_update(socket, doctype, callback) {
	subscribe_doctype(socket, doctype)
	socket.on('list_update', (data) => {
		if (data.doctype == doctype) {
			callback(data.name)
		}
	})
}

export function subscribe_doctype(socket, doctype, force) {
	if (doctypes_subscribed.has(doctype) && !force) {
		return;
	}

	socket.emit('doctype_subscribe', doctype)
	doctypes_subscribed.add(doctype);
}

export function subscribe_doc(socket, doctype, name, force) {
	if (docs_subscribed[doctype]?.has(name) && !force) {
		return;
	}

	socket.emit('doc_subscribe', doctype, name);

	if (!docs_subscribed[doctype]) {
		docs_subscribed[doctype] = new Set();
	}
	docs_subscribed[doctype].add(name);
}

export function unsubscribe_doc(socket, doctype, name) {
	socket.emit('doc_unsubscribe', doctype, name);
	docs_subscribed[doctype]?.delete(name);
}
