import {currency_list} from "@/data/currency";

export function flt(v, decimals, number_format, rounding_method) {
	if (v == null || v == "") return 0;

	if (!(typeof v === "number" || cstr(parseFloat(v)) == v)) {
		// cases in which this block should not run
		// 1. 'v' is already a number
		// 2. v is already parsed but in string form
		// if (typeof v !== "number") {

		v = v + "";
		v = strip(v);

		// strip currency symbol if exists
		if (v.indexOf(" ") != -1) {
			// using slice(1).join(" ") because space could also be a group separator
			var parts = v.split(" ");
			v = isNaN(parseFloat(parts[0])) ? parts.slice(parts.length - 1).join(" ") : v;
		}

		v = strip_number_groups(v, number_format);

		v = parseFloat(v);
		if (isNaN(v)) v = 0;
	}

	v = parseFloat(v);
	if (decimals != null) return _round(v, decimals, rounding_method);
	return v;
}

export function cstr (s) {
	if (s == null) return "";
	return s + "";
}

export function cint(v, def) {
	if (v === true) return 1;
	if (v === false) return 0;
	v = v + "";
	if (v !== "0") v = lstrip(v, ["0"]);
	v = parseInt(v); // eslint-ignore-line
	if (isNaN(v)) v = def === undefined ? 0 : def;
	return v;
}

export function format_number(v, format, decimals, always_show_decimals) {
	if (!format) {
		format = get_number_format();
		if (decimals == null) decimals = 2;
	}

	let info = get_number_format_info(format);

	// Fix the decimal first, toFixed will auto fill trailing zero.
	if (decimals == null) decimals = info.precision;

	v = flt(v, decimals, format);

	let is_negative = false;
	if (v < 0) is_negative = true;
	v = Math.abs(v);

	v = v.toFixed(decimals);

	var part = v.split(".");

	// get group position and parts
	var group_position = info.group_sep ? 3 : 0;

	if (group_position) {
		var integer = part[0];
		var str = "";
		var offset = integer.length % group_position;
		for (var i = integer.length; i >= 0; i--) {
			var l = replace_all(str, info.group_sep, "").length;
			if (format == "#,##,###.##" && str.indexOf(",") != -1) {
				// INR
				group_position = 2;
				l += 1;
			}

			str += integer.charAt(i);

			if (l && !((l + 1) % group_position) && i != 0) {
				str += info.group_sep;
			}
		}
		part[0] = str.split("").reverse().join("");
	}
	if (part[0] + "" == "") {
		part[0] = "0";
	}

	// join decimal
	if (part[1] && info.decimal_str && (cint(part[1]) !== 0 || always_show_decimals)) {
		part[1] = info.decimal_str + part[1];
	} else {
		part[1] = "";
	}

	// join
	return (is_negative ? "-" : "") + part[0] + part[1];
}

export function format_currency(v, currency, decimals) {
	const format = get_number_format(currency);
	const symbol = get_currency_symbol(currency);
	const show_symbol_on_right = get_symbol_on_right(currency);

	if (decimals === undefined) {
		decimals = 2;
	}

	if (symbol) {
		if (show_symbol_on_right) {
			return format_number(v, format, decimals, true) + symbol;
		}
		return symbol + format_number(v, format, decimals, true);
	}

	return format_number(v, format, decimals, true);
}

function get_currency_symbol(currency) {
	return currency_list.dataMap[currency]?.symbol;
}

function get_symbol_on_right(currency) {
	return !!currency_list.dataMap[currency]?.symbol_on_right;
}

function replace_all(s, t1, t2) {
	return s.split(t1).join(t2);
}

function get_number_format() {
	// ToDo get number format from system
	return "#,###.##";
}

function get_number_format_info(format) {
	let info = number_format_info[format];
	if (!info) {
		info = { decimal_str: ".", group_sep: "," };
	}

	// get the precision from the number format
	info.precision = format.split(info.decimal_str).slice(1)[0].length;

	return info;
}

const number_format_info = {
	"#,###.##": { decimal_str: ".", group_sep: "," },
	"#.###,##": { decimal_str: ",", group_sep: "." },
	"# ###.##": { decimal_str: ".", group_sep: " " },
	"# ###,##": { decimal_str: ",", group_sep: " " },
	"#'###.##": { decimal_str: ".", group_sep: "'" },
	"#, ###.##": { decimal_str: ".", group_sep: ", " },
	"#,##,###.##": { decimal_str: ".", group_sep: "," },
	"#,###.###": { decimal_str: ".", group_sep: "," },
	"#.###": { decimal_str: "", group_sep: "." },
	"#,###": { decimal_str: "", group_sep: "," },
}

function strip_number_groups(v, number_format) {
	if (!number_format) number_format = get_number_format();
	var info = get_number_format_info(number_format);

	// strip groups (,)
	var group_regex = new RegExp(info.group_sep === "." ? "\\." : info.group_sep, "g");
	v = v.replace(group_regex, "");

	// replace decimal separator with (.)
	if (info.decimal_str !== "." && info.decimal_str !== "") {
		var decimal_regex = new RegExp(info.decimal_str, "g");
		v = v.replace(decimal_regex, ".");
	}

	return v;
}


function _round(num, precision, rounding_method) {
	// ToDo get rounding method from system
	rounding_method = rounding_method || "Banker's Rounding (legacy)";

	let is_negative = num < 0 ? true : false;

	if (rounding_method == "Banker's Rounding (legacy)") {
		var d = cint(precision);
		var m = Math.pow(10, d);
		var n = +(d ? Math.abs(num) * m : Math.abs(num)).toFixed(8); // Avoid rounding errors
		var i = Math.floor(n),
			f = n - i;
		var r = !precision && f == 0.5 ? (i % 2 == 0 ? i : i + 1) : Math.round(n);
		r = d ? r / m : r;
		return is_negative ? -r : r;
	} else if (rounding_method == "Banker's Rounding") {
		if (num == 0) return 0.0;
		precision = cint(precision);

		let multiplier = Math.pow(10, precision);
		num = Math.abs(num) * multiplier;

		let floor_num = Math.floor(num);
		let decimal_part = num - floor_num;

		// For explanation of this method read python flt implementation notes.
		let epsilon = 2.0 ** (Math.log2(Math.abs(num)) - 52.0);

		if (Math.abs(decimal_part - 0.5) < epsilon) {
			num = floor_num % 2 == 0 ? floor_num : floor_num + 1;
		} else {
			num = Math.round(num);
		}
		num = num / multiplier;
		return is_negative ? -num : num;
	} else if (rounding_method == "Commercial Rounding") {
		if (num == 0) return 0.0;

		let digits = cint(precision);
		let multiplier = Math.pow(10, digits);

		num = num * multiplier;

		// For explanation of this method read python flt implementation notes.
		let epsilon = 2.0 ** (Math.log2(Math.abs(num)) - 52.0);
		if (is_negative) {
			epsilon = -1 * epsilon;
		}

		num = Math.round(num + epsilon);
		return num / multiplier;
	} else {
		throw new Error(`Unknown rounding method ${rounding_method}`);
	}
}

function strip(s, chars) {
	s = cstr(s);
	s = lstrip(s, chars);
	s = rstrip(s, chars);
	return s;
}

function lstrip(s, chars) {
	if (!chars) chars = ["\n", "\r", "\t", " "];
	// strip left
	let first_char = s.substr(0, 1);
	while (chars.includes(first_char)) {
		s = s.substr(1);
		first_char = s.substr(0, 1);
	}
	return s;
}

function rstrip(s, chars) {
	if (!chars) chars = ["\n", "\r", "\t", " "];
	let last_char = s.substr(s.length - 1);
	while (chars.includes(last_char)) {
		s = s.substr(0, s.length - 1);
		last_char = s.substr(s.length - 1);
	}
	return s;
}