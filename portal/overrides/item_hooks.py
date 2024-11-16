import frappe
from frappe.utils import cstr
from frappe.core.doctype.file.utils import get_local_image
from PIL import Image, ImageOps
import mimetypes
import io


def item_validate(doc, method):
	validate_image(doc)


def item_group_validate(doc, method):
	validate_image(doc)


def brand_validate(doc, method):
	validate_image(doc)


def validate_image(doc):
	# Set image field from attached image
	if not doc.image:
		set_attached_file_as_image(doc)

	# Optimize image if not already optimized
	if doc.image:
		new_file_url = get_optimized_image(doc.image, doc.doctype, doc.name, filename=doc.name)
		if new_file_url:
			doc.image = new_file_url

	# Create and set thumbnail if missing
	if doc.image:
		doc.thumbnail = get_thumbnail(doc.image)

	# Remove thumbnail if no image
	if not doc.image and doc.thumbnail:
		doc.thumbnail = None


def set_attached_file_as_image(doc):
	files = frappe.get_all("File", filters={
		"attached_to_doctype": doc.doctype, "attached_to_name": doc.name,
	}, fields=["distinct file_url as file_url"], pluck="file_url")

	images = [f for f in files if frappe.utils.is_image(f)]
	if len(images) == 1:
		doc.image = images[0]


def get_optimized_image(
	file_url,
	attached_to_doctype,
	attached_to_name,
	max_width=1920,
	max_height=1080,
	quality=85,
	filename=None,
):
	if not file_url:
		return None

	# Load File
	file_details = frappe.db.get_value(
		"File",
		fieldname=["name", "file_name", "file_url", "folder", "is_portal_optimized"],
		filters={"file_url": file_url, "attached_to_doctype": attached_to_doctype, "attached_to_name": attached_to_name},
		as_dict=1,
		order_by="is_portal_optimized desc",
	)
	if not file_details:
		return None
	if file_details.is_portal_optimized:
		return file_details.file_url

	mime_type = mimetypes.guess_type(file_details.file_name)[0]
	if mime_type == "image/svg+xml":
		return file_details.file_url

	image, original_filename, ext = get_local_image(file_url)
	image_format = cstr(image.format).lower()

	# Convert to JPEG if not a standard format
	if image_format not in ["jpeg", "png", "gif"]:
		image_format = "jpeg"
		ext = "jpg"

	# Convert to RGB
	if image_format == "jpeg" and image.mode != "RGB":
		image = image.convert("RGB")

	# Fix orientation
	image = ImageOps.exif_transpose(image)

	# Remove EXIF
	if "exif" in image.info:
		del image.info["exif"]

	# Optimize
	size = (max_width, max_height)
	image.thumbnail(size, Image.Resampling.LANCZOS)

	output = io.BytesIO()
	image.save(
		output,
		format=image_format,
		optimize=True,
		quality=quality,
		save_all=True if image_format == "gif" else None,
	)

	if filename:
		new_filename = f"{filename}.{ext}"
	else:
		new_filename = original_filename.split("/")[-1]
		new_filename = f"{new_filename}_optimized.{ext}"

	new_file_doc = frappe.new_doc("File")
	new_file_doc.content = output.getvalue()
	new_file_doc.file_name = new_filename
	new_file_doc.is_private = 0
	new_file_doc.folder = file_details.folder
	new_file_doc.attached_to_doctype = attached_to_doctype
	new_file_doc.attached_to_name = attached_to_name
	new_file_doc.is_portal_optimized = 1
	new_file_doc.save()

	return new_file_doc.file_url


def get_thumbnail(file_url):
	if not file_url:
		return None

	# Load File
	file_details = frappe.db.get_value(
		"File",
		fieldname=["name", "thumbnail_url"],
		filters={"file_url": file_url, "is_portal_optimized": 1},
		as_dict=1
	)
	if not file_details:
		return None
	if file_details.thumbnail_url:
		return file_details.thumbnail_url

	doc = frappe.get_doc("File", file_details)
	return doc.make_thumbnail(width=600, height=600)
