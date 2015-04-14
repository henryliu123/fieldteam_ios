/*
 * This class is the parent class of filter_job, filter_quote,local_job and local_quote
 * support scoll down table view to download more info
 */

Titanium.include('fieldteam.js');
function transaction_page() {
	var self = this;
	self.window_source = 'transaction_page';
}

// get parent class's prototype object
var FB = function() {
};
FB.prototype = FieldTeam.prototype;
transaction_page.prototype = new FB();
transaction_page.prototype.constructor = transaction_page;

// class member
transaction_page.prototype.path = '';
transaction_page.prototype.download_type = '';
transaction_page.prototype.job_extra_where = '';
transaction_page.prototype.pull_down_to_update = false;
transaction_page.prototype.pull_down_to_download_more = false;
transaction_page.prototype.pulling = false;
transaction_page.prototype.contentOffset_y = 0;
transaction_page.prototype.downloading = false;
/**
 * init functon
 */
transaction_page.prototype.init_table_view = function(type, extra_bottom_distance) {
	var self = this;
	try {
		self.table_view = Ti.UI.createTableView({
			data : self.data,
			style : (((type === undefined) || (self.trim(type) === 'grouped')) && (!self.is_ios_7_plus())) ? Ti.UI.iPhone.TableViewStyle.GROUPED : Ti.UI.iPhone.TableViewStyle.PLAIN,
			minRowHeight : self.default_table_view_row_height
		});
		if ((extra_bottom_distance != undefined) && (extra_bottom_distance != null) && (extra_bottom_distance > 0)) {
			self.table_view.bottom = extra_bottom_distance;
		}
		Titanium.UI.currentWindow.add(self.table_view);
		
		if (self.pull_down_to_update || self.pull_down_to_download_more) {
			self.table_view.headerPullView = self.init_pull_down_view();
		}
		
		self.table_view.addEventListener('click', function(e) {
			self.table_view_click_event(e);
		});
		
		self.table_view.addEventListener('scroll', function(e) {
			if (self.pull_down_to_update || self.pull_down_to_download_more) {
				self.table_view_scroll_event(e);
			}
		});
		
		self.table_view.addEventListener('scrollEnd', function(e) {
			if (self.pull_down_to_update || self.pull_down_to_download_more) {
				self.table_view_scroll_end_event(e);
			}
		});
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.init_table_view');
		return;
	}
};
/**
 * create pull down view
 */
transaction_page.prototype.init_pull_down_view = function() {
	var self = this;
	try {
		self.pulling = false;
		self.downloading = false;
		self.contentOffset_y = 0;
		var pull_view_border = Ti.UI.createView({
			backgroundColor : "#576c89",
			height : 2,
			bottom : 0
		});
		var table_view_header = Ti.UI.createView({
			backgroundColor : self.tool_bar_background_color,
			width : 320,
			height : 60
		});
		// fake it til ya make it.. create a 2 pixel
		// bottom border
		table_view_header.add(pull_view_border);
		var pull_view_arrow = Ti.UI.createView({
			backgroundImage : self.get_file_path('image', 'whiteArrow.png'),
			width : 23,
			height : 60,
			bottom : 10,
			left : 20
		});
		var pull_view_status_label = Ti.UI.createLabel({
			text : "Pull down to download ...",
			width : self.screen_width,
			left : 30,
			bottom : 25,
			height : 20,
			color : "#576c89",
			textAlign : "center",
			font : {
				fontSize : 12,
				fontWeight : "bold"
			}
		});
		var pull_view_last_updated = Ti.UI.createLabel({
			text : 'Last Updated : ' + self.get_last_updated_time_text(),
			left : 30,
			width : self.screen_width,
			bottom : 10,
			height : 12,
			color : "#576c89",
			textAlign : "center",
			font : {
				fontSize : 12
			}
		});
		table_view_header.add(pull_view_arrow);
		table_view_header.add(pull_view_status_label);
		table_view_header.add(pull_view_last_updated);
		return table_view_header;
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.init_pull_down_view');
		return null;
	}
};
/**
 * table view :scroll down event
 */
transaction_page.prototype.table_view_scroll_event = function(e) {
	var self = this;
	try {
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !self.pulling) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			self.pulling = true;
			self.contentOffset_y = offset;
			self.table_view.headerPullView.children[1].animate({
				transform : t,
				duration : 180
			});
			self.table_view.headerPullView.children[2].text = "Release to download ...";
		} else if (self.pulling && offset > -65.0 && offset < 0) {
			t = Ti.UI.create2DMatrix();
			self.table_view.headerPullView.children[1].animate({
				transform : t,
				duration : 180
			});
			self.table_view.headerPullView.children[2].text = "Pull down to download ...";
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.table_view_scroll_event');
		return;
	}
};
/**
 * table view :scroll down end event
 */
transaction_page.prototype.table_view_scroll_end_event = function(e) {
	var self = this;
	try {
		if (self.pulling && !self.downloading && self.contentOffset_y <= -65.0) {
			if (Ti.Network.online) {
				if (self.pull_down_to_update || self.pull_down_to_download_more) {
					self.downloading = true;
					self.pulling = false;
					self.contentOffset_y = 0;
					self.table_view.headerPullView.children[1].hide();
					self.table_view.headerPullView.children[2].text = "Downloading...";
					self.table_view.setContentInsets({
						top : 60
					}, {
						animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
					});
					self.table_view.headerPullView.children[1].transform = Ti.UI.create2DMatrix();
					if (self.pull_down_to_update && self.pull_down_to_download_more) {
						self.download_latest_log_and_download_more_jobs();
					} else {
						if (self.pull_down_to_update) {
							// call latest log and
							// update local database
							self.download_latest_log(false);
						}
						if (self.pull_down_to_download_more) {
							// download more
							self.begin_download_more_jobs_by_scroll_down();
						}
					}
				}
			} else {
				self.end_download_more_jobs_by_scroll_down(true);
				self.show_message(L('message_offline'), L('message_unable_to_connect'));
				return;
			}
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.table_view_scroll_end_event');
		return;
	}
};
/**
 * display job or quote row this is a common function for display job list , so
 * as to easy to update it in the future
 */
transaction_page.prototype.setup_job_row_for_job_list = function(params) {
	var self = this;
	try {
		var row = Ti.UI.createTableViewRow({
			height : 'auto',
			job_type : params.job_type,
			className : params.class_name,
			job_id : params.job_id,
			job_reference_number : params.job_reference_number,
			job_status_code : params.job_status_code
		});
		if (params.is_header) {
			row.header = params.header_text;
		}
		var status_colour_label = Ti.UI.createLabel({
			top : 0,
			height : 90,
			width : 10,
			left : 0,
			backgroundColor : params.job_status_color
		});
		row.add(status_colour_label);
		
		var time_text = '';
		if (params.assigned_from_hours != '') {
			if (params.assigned_from_hours <= 9) {
				time_text += '0' + params.assigned_from_hours;
			} else {
				time_text += params.assigned_from_hours;
			}
			if (params.assigned_from_minutes <= 9) {
				time_text += ':0' + params.assigned_from_minutes;
			} else {
				time_text += ':' + params.assigned_from_minutes;
			}
		} else {
			if (params.assigned_from_hours === 0) {
				if (params.assigned_from_hours <= 9) {
					time_text += '0' + params.assigned_from_hours;
				} else {
					time_text += params.assigned_from_hours;
				}
				if (params.assigned_from_minutes <= 9) {
					time_text += ':0' + params.assigned_from_minutes;
				} else {
					time_text += ':' + params.assigned_from_minutes;
				}
			}
		}
		if (time_text != '') {
			if ((params.assigned_user_count != undefined) && (params.assigned_user_count != null) && (params.assigned_user_count > 1)) {
				var multi_label = Ti.UI.createLabel({
					height : 20,
					width : 50,
					left : 15,
					textAlign : 'center',
					text : 'Multi',
					font : {
						fontSize : 20,
						fontWeight : self.font_weight
					}
				});
				row.add(multi_label);
			} else {
				time_text = ' ' + time_text;
				var assigned_to_time_text = '';
				if (params.assigned_to_hours != '') {
					if (params.assigned_to_hours != '') {
						if (params.assigned_to_hours <= 9) {
							assigned_to_time_text += '0' + params.assigned_to_hours;
						} else {
							assigned_to_time_text += params.assigned_to_hours;
						}
						if (params.assigned_to_minutes <= 9) {
							assigned_to_time_text += ':0' + params.assigned_to_minutes;
						} else {
							assigned_to_time_text += ':' + params.assigned_to_minutes;
						}
					}
				}
				if (assigned_to_time_text != '') {
					time_text += '\n     - \n ' + assigned_to_time_text;
				}
				var time_label = Ti.UI.createLabel({
					height : 'auto',
					width : 50,
					left : 15,
					textAlign : 'left',
					text : time_text,
					font : {
						fontSize : self.normal_font_size,
						fontWeight : self.font_weight
					}
				});
				row.add(time_label);
			}
		} else {
			var na_label = Ti.UI.createLabel({
				height : 20,
				width : 50,
				left : 15,
				textAlign : 'center',
				text : 'N/A',
				font : {
					fontSize : 20,
					fontWeight : self.font_weight
				}
			});
			row.add(na_label);
		}
		
		var sub_number = params.sub_number;
		var unit = params.unit_number;
		if ((unit === '') || (unit === null)) {
			unit = '';
		} else {
			if ((sub_number === '') || (sub_number === null)) {
				unit = unit + '/';
			} else {
				unit = unit + '-' + sub_number + '/';
			}
		}
		
		var street_no = params.street_number;
		street_no = ((street_no === '') || (street_no === null)) ? '' : street_no;
		
		var street_type = params.street_type;
		var street = (params.street === null) ? '' : self.trim(params.street);
		street = self.display_correct_street(street, street_type);
		var suburb = params.suburb;
		suburb = (suburb === null) ? '' : suburb;
		var postcode = params.postcode;
		postcode = (postcode === null) ? '' : postcode;
		var address = '';
		if (street === '') {
			if(suburb == ''){
				address = '(Blank)';
			}else{
				address = suburb + (postcode == '' ? '' : ' ' + postcode);
			}
		} else {
			address = unit + street_no + ' ' + street + ', ' + suburb + (postcode == '' ? '' : ' ' + postcode);
		}
		if (address != '') {
			address = address.toUpperCase();
		}
		
		var job_reference_number = Ti.UI.createLabel({
			height : 20,
			width : self.screen_width - 80,
			left : 75,
			top : 5,
			textAlign : 'left',
			text : 'No. - ' + params.job_reference_number,
			font : {
				fontSize : self.normal_font_size,
				fontWeight : self.font_weight
			}
		});
		row.add(job_reference_number);
		
		var job_status = Ti.UI.createLabel({
			height : 20,
			width : self.screen_width - 80,
			left : 75,
			top : 25,
			textAlign : 'left',
			text : params.job_status_name,
			font : {
				fontSize : self.middle_font_size
			}
		});
		row.add(job_status);
		
		var job_address = Ti.UI.createLabel({
			height : 20,
			width : self.screen_width - 80,
			left : 75,
			top : 45,
			textAlign : 'left',
			text : address,
			font : {
				fontSize : self.middle_font_size
			}
		});
		row.add(job_address);
		
		// var job_description_len = (rows.fieldByName('description') !=
		// '')?rows.fieldByName('description').length:0;
		var job_title = Ti.UI.createLabel({
			height : 20,
			width : self.screen_width - 80,
			left : 75,
			top : 65,
			bottom : 5,
			textAlign : 'left',
			text : params.job_title,
			font : {
				fontSize : self.middle_font_size
			}
		});
		row.add(job_title);
		params = null;
		return row;
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.setup_job_row_for_job_list');
		return null;
	}
};
/**
 * set query for display all job or quotes which's assigned user' assigned_from
 * is null
 */
transaction_page.prototype.setup_sql_query_for_display_job_list = function(params) {
	var self = this;
	try {
		// params.is_task = (params.is_task ===
		// undefined)?0:params.is_task;
		params.is_search = (params.is_search === undefined) ? false : params.is_search;
		var select_str = '', where_str = ' WHERE ', order_str = ' order by ' + params.order_by;
		if ((params.is_calendar != undefined) && (params.is_calendar)) {
			select_str += ' SELECT my_' + params.type + '.*,my_' + params.type + '_assigned_user.assigned_from as assigned_from,my_' + params.type + '_assigned_user.assigned_to as assigned_to FROM my_' + params.type;
			select_str += ' left join my_' + params.type + '_assigned_user on (my_' + params.type + '_assigned_user.status_code=1 ';
		} else {
			// select all jobs, while get min(assigned_from) and
			// max(assigned_to) from all assigned_user
			select_str += ' SELECT my_' + params.type + '.*,';
			select_str += ' (SELECT MIN(assigned_from) from my_' + params.type + '_assigned_user WHERE my_' + params.type + '_assigned_user.status_code=1 and my_' + params.type + '_assigned_user.' + params.type + '_id=my_' + params.type + '.id) as assigned_from,';
			select_str += ' (SELECT MAX(assigned_to) from my_' + params.type + '_assigned_user WHERE my_' + params.type + '_assigned_user.status_code=1 and my_' + params.type + '_assigned_user.' + params.type + '_id=my_' + params.type + '.id) as assigned_to ';
			select_str += ' FROM my_' + params.type + ' ';
		}
		if ((params.is_check_self_job != undefined) && (params.is_check_self_job)) {
			select_str += ' and my_' + params.type + '_assigned_user.manager_user_id=' + params.user_id;
		}
		if ((params.extra_left_join_condition != undefined) && (params.extra_left_join_condition != '')) {
			select_str += ' and ' + params.extra_left_join_condition + ' ';
		}
		where_str += ' my_' + params.type + '.company_id=' + params.company_id + ' and my_' + params.type + '.status_code=1 ';
		if (params.is_task != undefined && params.is_task) {
			where_str += ' and my_' + params.type + '.is_task=1';
		} else {
			if (params.is_task != undefined) {
				where_str += ' and my_' + params.type + '.is_task = 0';
			}
		}
		if ((params.is_check_local_job != undefined) && (params.is_check_local_job != null) && (params.is_check_local_job)) {
		} else {
			where_str += ' and my_' + params.type + '.id <1000000000 ';
		}
		
		if ((params.is_calendar != undefined) && (params.is_calendar)) {
			where_str += ' and my_' + params.type + '.id=my_' + params.type + '_assigned_user.' + params.type + '_id ';
			select_str += ') ';
		} else {
			// select_str+= ' and
			// my_'+params.type+'.id=my_'+params.type+'_assigned_user.'+params.type+'_id
			// ';
		}
		
		if ((params.extra_where_condition != undefined) && (params.extra_where_condition != '')) {
			where_str += ' and ' + params.extra_where_condition + ' ';
		}
		if ((params.job_status_code != undefined) && (params.job_status_code != -1)) {
			where_str += ' and my_' + params.type + '.' + params.type + '_status_code=' + params.job_status_code + ' ';
		}
		if ((params.is_check_changed != undefined) && (params.is_check_changed)) {
			where_str += ' and my_' + params.type + '.changed=1 ';
		}
		if ((params.is_search != undefined) && (params.is_search)) {
			where_str += ' and (reference_number like \'%' + params.search_string + '%\') or (sub_number like \'%' + params.search_string + '%\') or (unit_number like \'%' + params.search_string + '%\') or (street_number like \'%' + params.search_string + '%\') or (street like \'%' + params.search_string + '%\') or (suburb like \'%' + params.search_string + '%\') or (postcode like \'%' + params.search_string + '%\') or (title like \'%' + params.search_string
							+ '%\') or (description like \'%' + params.search_string + '%\') ';
		}
		return select_str + where_str + order_str;
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.setup_sql_query_for_display_job_list');
		return '';
	}
};
/*
 * update local database and automatic download latest data compare the updated
 * data's time and latest updated time of local database
 * 
 * step 1: download all new log info after lateset updated , include model,pk_id
 * step 2: compare them with local database, get model and pk_id of which need
 * to update step 3: download data by model and pk_id of filted result params:
 * path is the relative path with database folder property_name is the a
 * properity name in different page. e.g. in main page, the property name is
 * main_page_download_latest_log in bg page, the property name is
 * bg_page_download_latest_log in login page, the property name is
 * login_page_download_latest_log
 */
transaction_page.prototype.download_latest_log = function(is_download_async) {
	var self = this;
	try {
		if (Ti.Network.online) {
			// if os is downloading latest log then return
			var library_last_updated = 0;
			var db = Titanium.Database.open(self.get_db_name());
			var rows = db.execute('SELECT * FROM my_frontend_config_setting where name=?', 'library_last_updated');
			if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
				library_last_updated = parseInt(rows.fieldByName('value'), 10);
				var library_last_updated2 = parseInt(Titanium.App.Properties.getString('library_last_updated'), 10);
				if (library_last_updated2 != library_last_updated) {
					library_last_updated = library_last_updated2;
				}
				if (isNaN(library_last_updated)) {
					library_last_updated = 0;
				}
			}
			rows.close();
			
			var selected_company_id = Ti.App.Properties.getString('current_company_id');
			var selected_login_user_id = Ti.App.Properties.getString('current_login_user_id');
			
			var job_id_array = [];
			rows = db.execute('SELECT DISTINCT(id) FROM my_job where company_id=? and id< 1000000000', selected_company_id);
			if (rows != null) {
				while (rows.isValidRow()) {
					job_id_array.push(rows.fieldByName('id'));
					rows.next();
				}
			}
			rows.close();
			
			var quote_id_array = [];
			rows = db.execute('SELECT DISTINCT(id) FROM my_quote where company_id=? and id< 1000000000', selected_company_id);
			if (rows != null) {
				while (rows.isValidRow()) {
					quote_id_array.push(rows.fieldByName('id'));
					rows.next();
				}
			}
			rows.close();
			db.close();
			
			if ((is_download_async === undefined) || (is_download_async === null)) {
				is_download_async = true;
			}
			
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {
					if ((xhr.readyState === 4) && (this.status === 200)) {
						var is_in_background_service = Ti.App.Properties.getBool('is_in_background_service');
						if (is_in_background_service === false) {
							if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
								return;
							}
						}
						if (self.display_app_version_incompatiable(this.responseText)) {
							self.downloading = false;
							return;
						}
						self.refresh_job_and_relative_tables(this.responseText, 'top');
						// set properties:
						// active_material_location
						db = Titanium.Database.open(self.get_db_name());
						rows = db.execute('SELECT * FROM my_company WHERE id=?', selected_company_id);
						if (rows.isValidRow()) {
							Ti.App.Properties.setString('current_company_active_material_location', rows.fieldByName('active_material_location'));
						}
						rows.close();
						db.close();
						
						// refresh app badge amount
						self.refresh_app_badge();
						
						// display local notification if
						// have new job and run in
						// background service
						Ti.API.info('is_in_background_service:' + is_in_background_service);
						if (is_in_background_service != undefined && is_in_background_service != null && is_in_background_service === true) {
							var result = JSON.parse(this.responseText);
							if ((result === undefined) || (result === null) || (result.have_new_job === undefined) || (result.have_new_job === null) || (result.have_new_job === 0)) {
							} else {
								Ti.App.iOS.scheduleLocalNotification({
									alertBody : "You have new job.",
									alertAction : "Re-Launch!",
									userInfo : {
										"FieldTeam" : "New Job"
									},
									sound : "pop.caf",
									date : new Date(new Date().getTime() + 3000)
								// 3
								// seconds
								// after
								// backgrounding
								});
							}
						}
					} else {
						self.downloading = false;
						var params = {
							message : 'Download latest log failed.',
							show_message : false,
							message_title : '',
							send_error_email : true,
							error_message : '',
							error_source : self.window_source + ' - transaction_page.prototype.download_latest_log - xhr.onload - 1',
							server_response_message : this.responseText
						};
						self.processXYZ(params);
						return;
					}
				} catch (e) {
					self.downloading = false;
					params = {
						message : 'Download latest log failed.',
						show_message : false,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.download_latest_log - xhr.onload - 2',
						server_response_message : this.responseText
					};
					self.processXYZ(params);
					return;
				}
			};
			xhr.onerror = function(e) {
				self.downloading = false;
				var isPass = true;
				if ((self.getObjectSource(e).indexOf('The request timed out') == -1)) {
					isPass = false;
				}
				if ((self.getObjectSource(e).indexOf('A connection failure occurred') == -1)) {
					isPass = false;
				}
				if (!isPass) {
					var params = {
						message : 'Download latest log failed.',
						show_message : false,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.download_latest_log - xhr.onerror',
						server_response_message : this.responseText
					};
					self.processXYZ(params);
				}
				return;
			};
			xhr.setTimeout(self.default_time_out);
			xhr.open('POST', self.get_host_url() + 'update', is_download_async);
			xhr.send({
				'type' : 'download_latest_log',
				'library_last_updated' : library_last_updated,
				'company_id' : selected_company_id,
				'user_id' : selected_login_user_id,
				'hash' : selected_login_user_id,
				'existed_job_id_string' : (job_id_array.length > 0) ? job_id_array.join(',') : '',
				'existed_quote_id_string' : (quote_id_array.length > 0) ? quote_id_array.join(',') : '',
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		} else {
			self.downloading = false;
		}
	} catch (err) {
		self.downloading = false;
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.download_latest_log');
		return;
	}
};
transaction_page.prototype.download_latest_log_for_login_page = function(is_download_async) {
	var self = this;
	try {
		if (Ti.Network.online) {
			// if os is downloading latest log then return
			var library_last_updated = 0;
			var db = Titanium.Database.open(self.get_db_name());
			var rows = db.execute('SELECT * FROM my_frontend_config_setting where name=?', 'library_last_updated');
			if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
				library_last_updated = parseInt(rows.fieldByName('value'), 10);
				var library_last_updated2 = parseInt(Titanium.App.Properties.getString('library_last_updated'), 10);
				if (library_last_updated2 != library_last_updated) {
					library_last_updated = library_last_updated2;
				}
				if (isNaN(library_last_updated)) {
					library_last_updated = 0;
				}
			}
			rows.close();
			
			var selected_company_id = Ti.App.Properties.getString('current_company_id');
			var selected_login_user_id = Ti.App.Properties.getString('current_login_user_id');
			
			var job_id_array = [];
			rows = db.execute('SELECT DISTINCT(id) FROM my_job where company_id=? and id< 1000000000', selected_company_id);
			if (rows != null) {
				while (rows.isValidRow()) {
					job_id_array.push(rows.fieldByName('id'));
					rows.next();
				}
			}
			rows.close();
			
			var quote_id_array = [];
			rows = db.execute('SELECT DISTINCT(id) FROM my_quote where company_id=? and id< 1000000000', selected_company_id);
			if (rows != null) {
				while (rows.isValidRow()) {
					quote_id_array.push(rows.fieldByName('id'));
					rows.next();
				}
			}
			rows.close();
			db.close();
			
			if ((is_download_async === undefined) || (is_download_async === null)) {
				is_download_async = true;
			}
			
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {
					if ((xhr.readyState === 4) && (this.status === 200)) {
						
						self.refresh_job_and_relative_tables(this.responseText, 'top');
						// set properties:
						// active_material_location
						db = Titanium.Database.open(self.get_db_name());
						rows = db.execute('SELECT * FROM my_company WHERE id=?', selected_company_id);
						if (rows.isValidRow()) {
							Ti.App.Properties.setString('current_company_active_material_location', rows.fieldByName('active_material_location'));
						}
						rows.close();
						db.close();
						
						// refresh app badge amount
						self.refresh_app_badge();
						
						// display local notification if
						// have new job and run in
						// background service
						var is_in_background_service = Ti.App.Properties.getBool('is_in_background_service');
						Ti.API.info('is_in_background_service2:' + is_in_background_service);
						if (is_in_background_service != undefined && is_in_background_service != null && is_in_background_service === true) {
							var result = JSON.parse(this.responseText);
							if ((result === undefined) || (result === null) || (result.have_new_job === undefined) || (result.have_new_job === null) || (result.have_new_job === 0)) {
							} else {
								Ti.App.iOS.scheduleLocalNotification({
									alertBody : "You have new job.",
									alertAction : "Re-Launch!",
									userInfo : {
										"FieldTeam" : "New Job"
									},
									sound : "pop.caf",
									date : new Date(new Date().getTime() + 3000)
								// 3
								// seconds
								// after
								// backgrounding
								});
							}
						}
					} else {
						self.downloading = false;
						var params = {
							message : 'Download latest log failed.',
							show_message : false,
							message_title : '',
							send_error_email : true,
							error_message : '',
							error_source : self.window_source + ' - transaction_page.prototype.download_latest_log_for_login_page - xhr.onload - 1',
							server_response_message : this.responseText
						};
						self.processXYZ(params);
						return;
					}
				} catch (e) {
					self.downloading = false;
					params = {
						message : 'Download latest log failed.',
						show_message : false,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.download_latest_log_for_login_page - xhr.onload - 2',
						server_response_message : this.responseText
					};
					self.processXYZ(params);
					return;
				}
			};
			xhr.onerror = function(e) {
				self.downloading = false;
				var params = {
					message : 'Download latest log failed.',
					show_message : false,
					message_title : '',
					send_error_email : true,
					error_message : e,
					error_source : self.window_source + ' - transaction_page.prototype.download_latest_log_for_login_page - xhr.onerror',
					server_response_message : this.responseText
				};
				self.processXYZ(params);
				return;
			};
			xhr.setTimeout(self.default_time_out);
			xhr.open('POST', self.get_host_url() + 'update', is_download_async);
			xhr.send({
				'type' : 'download_latest_log',
				'library_last_updated' : library_last_updated,
				'company_id' : selected_company_id,
				'user_id' : selected_login_user_id,
				'hash' : selected_login_user_id,
				'existed_job_id_string' : (job_id_array.length > 0) ? job_id_array.join(',') : '',
				'existed_quote_id_string' : (quote_id_array.length > 0) ? quote_id_array.join(',') : '',
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		} else {
			self.downloading = false;
		}
	} catch (err) {
		self.downloading = false;
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.download_latest_log_for_login_page');
		return;
	}
};

transaction_page.prototype.refresh_app_badge = function() {
	var self = this;
	try {
		var app_badge = 0;
		var _selected_company_id = Ti.App.Properties.getString('current_company_id');
		var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
		var new_date = new Date();
		var calendar_year = new_date.getFullYear();
		var calendar_month = new_date.getMonth();
		var calendar_date = new_date.getDate();
		var temp_month = ((calendar_month + 1) <= 9) ? '0' + (calendar_month + 1) : (calendar_month + 1);
		var temp_date = (calendar_date <= 9) ? '0' + calendar_date : calendar_date;
		var day_string = calendar_year + '-' + temp_month + '-' + temp_date;
		// get today's my jobs for my calendar
		var temp_start_value = day_string + ' 00:00:00';
		var temp_end_value = day_string + ' 23:59:59';
		// query job
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('SELECT my_job.*,my_job_assigned_user.assigned_from as assigned_from,my_job_assigned_user.assigned_to as assigned_to FROM my_job ' + 'left join my_job_assigned_user on (my_job_assigned_user.status_code=1 and my_job_assigned_user.manager_user_id=? and my_job_assigned_user.assigned_from != \'NULL\' ' + 'and ((my_job_assigned_user.assigned_from <=\'' + temp_end_value + '\' and my_job_assigned_user.assigned_to>=\'' + temp_start_value + '\')or'
						+ '(my_job_assigned_user.assigned_from <= \'' + temp_end_value + '\' and my_job_assigned_user.assigned_to>=\'' + temp_end_value + '\') or ' + '(my_job_assigned_user.assigned_from >= \'' + temp_start_value + '\' and my_job_assigned_user.assigned_from <= \'' + temp_end_value + '\'))) ' + 'WHERE my_job.company_id=? and my_job.status_code=1 and my_job.id < 1000000000 and my_job_assigned_user.job_id = my_job.id '
						+ 'and my_job.job_status_code not in (1,6,7,8,10)', _selected_user_id, _selected_company_id);
		if (rows.getRowCount() > 0) {
			app_badge = rows.getRowCount();
		}
		rows.close();
		db.close();
		Ti.API.info('latest log app_badge:' + app_badge);
		if (app_badge > 0) {
			Titanium.UI.iPhone.appBadge = app_badge;
		} else {
			Titanium.UI.iPhone.appBadge = null;
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.refresh_app_badge');
		return;
	}
};
/**
 * get job extra condition when query more jobs
 */
transaction_page.prototype.get_extra_conditions_when_download_more_jobs = function() {
};
/**
 * scoll down table view and download more jobs
 */
transaction_page.prototype.begin_download_more_jobs_by_scroll_down = function() {
	var self = this;
	try {
		if (Ti.Network.online) {
			self.get_extra_conditions_when_download_more_jobs();
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {
					if ((xhr.readyState === 4) && (this.status === 200)) {
						if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
							return;
						}
						if (self.display_app_version_incompatiable(this.responseText)) {
							self.end_download_more_jobs_by_scroll_down(true);
							return;
						}
						switch (self.download_type){
							case 'job':
							case 'quote':
								self.refresh_job_and_relative_tables(this.responseText, self.download_type);
								break;
							case 'both':// job
								// and
								// quote
								self.refresh_job_and_relative_tables(this.responseText, 'all');
								break;
						}
						Ti.App.Properties.setBool('lock_table_flag', false);
						self.end_download_more_jobs_by_scroll_down(true);
					} else {
						Ti.App.Properties.setBool('lock_table_flag', false);
						self.end_download_more_jobs_by_scroll_down(true);
						var params = {
							message : 'Download more ' + self.download_type + ' failed.',
							show_message : true,
							message_title : '',
							send_error_email : true,
							error_message : '',
							error_source : self.window_source + ' - transaction_page.prototype.begin_download_more_jobs_by_scroll_down - xhr.onload - 1',
							server_response_message : this.responseText
						};
						self.processXYZ(params);
						return;
					}
				} catch (e) {
					Ti.App.Properties.setBool('lock_table_flag', false);
					self.end_download_more_jobs_by_scroll_down(true);
					params = {
						message : 'Download more ' + self.download_type + ' failed.',
						show_message : true,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.begin_download_more_jobs_by_scroll_down - xhr.onload - 2',
						server_response_message : this.responseText
					};
					self.processXYZ(params);
					return;
				}
			};
			xhr.onerror = function(e) {
				Ti.App.Properties.setBool('lock_table_flag', false);
				self.end_download_more_jobs_by_scroll_down(true);
				var params = {
					message : 'Download more ' + self.download_type + ' failed.',
					show_message : true,
					message_title : '',
					send_error_email : true,
					error_message : e,
					error_source : self.window_source + ' - transaction_page.prototype.begin_download_more_jobs_by_scroll_down - xhr.onerror',
					server_response_message : this.responseText
				};
				self.processXYZ(params);
				return;
			};
			xhr.setTimeout(self.default_time_out);
			xhr.open('POST', self.get_host_url() + 'update', false);
			xhr.send({
				'type' : 'download_more_job',
				'hash' : Ti.App.Properties.getString('current_login_user_id'),
				'company_id' : self.selected_company_id,
				'user_id' : self.selected_user_id,
				'existed_job_id_string' : self.existed_job_id_string,
				'existed_quote_id_string' : self.existed_quote_id_string,
				'is_exist_search_text' : false,// query by
				// search text
				'is_exist_query_field' : false,// query fixed
				// field,e.g.
				// reference_number
				// or strta plan
				'job_extra_where' : self.job_extra_where,
				'job_type' : self.download_type,
				'view_type' : self.view_name,
				'limit' : self.count_for_job_query,
				'date' : self.calendar_year + '-' + (((self.calendar_month + 1) <= 9) ? '0' + (self.calendar_month + 1) : (self.calendar_month + 1)) + '-' + ((self.calendar_date <= 9) ? '0' + self.calendar_date : self.calendar_date),
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		} else {
			Ti.App.Properties.setBool('lock_table_flag', false);
			self.end_download_more_jobs_by_scroll_down(true);
			self.show_message(L('message_offline'), L('message_unable_to_connect'));
			return;
		}
	} catch (e) {
		Ti.App.Properties.setBool('lock_table_flag', false);
		self.end_download_more_jobs_by_scroll_down(true);
		var params = {
			message : 'Download more ' + self.download_type + ' failed.',
			show_message : true,
			message_title : '',
			send_error_email : true,
			error_message : e,
			error_source : self.window_source + ' - transaction_page.prototype.begin_download_more_jobs_by_scroll_down - 3',
			server_response_message : ''
		};
		self.processXYZ(params);
		return;
	}
};
/**
 * scoll down table view and end download more jobs
 */
transaction_page.prototype.end_download_more_jobs_by_scroll_down = function(is_hide_indicator) {
	var self = this;
	try {
		self.table_view.setContentInsets({
			top : 0
		}, {
			animated : (self.is_ios_7_plus() && !self.set_animated_for_ios7) ? false : true
		});
		self.pulling = false;
		self.downloading = false;
		self.contentOffset_y = 0;
		self.table_view.headerPullView.children[2].text = "Pull down to download ...";
		self.table_view.headerPullView.children[1].show();
		if (is_hide_indicator) {
			self.hide_indicator();
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.end_download_more_jobs_by_scroll_down');
		return;
	}
};

/**
 * set gps level by battery status
 */
transaction_page.prototype.set_gps_level_by_battery_status = function() {
	var self = this;
	try {
		Titanium.Platform.batteryMonitoring = true;
		Titanium.Platform.addEventListener('battery', function(e) {
			self.get_location_event();
		});
		var selectedGPSIndex = 0;
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
		if (rows.isValidRow()) {
			selectedGPSIndex = parseInt(rows.fieldByName('value'), 10);
			Ti.API.info('selectedGPSInterval title:' + self.gps_settings[selectedGPSIndex - 1].title);
		}
		rows.close();
		db.close();
		if (selectedGPSIndex == 4) {// gps off
			Ti.App.Properties.setString('gps_level', 'GPS Off');
			return;
		}
		switch (Titanium.Platform.batteryState){
			case Titanium.Platform.BATTERY_STATE_CHARGING:
				Ti.App.Properties.setString('battery_status', 'BATTERY_STATE_CHARGING');
				break;
			case Titanium.Platform.BATTERY_STATE_FULL:
				Ti.App.Properties.setString('battery_status', 'BATTERY_STATE_FULL');
				break;
			case Titanium.Platform.BATTERY_STATE_UNPLUGGED:
				Ti.App.Properties.setString('battery_status', 'BATTERY_STATE_UNPLUGGED');
				break;
			default:
				Ti.App.Properties.setString('battery_status', 'BATTERY_STATE_UNKNOWN');
		}
		Ti.App.Properties.setString('battery_level', (Titanium.Platform.batteryLevel == undefined) ? 'Unknown' : Titanium.Platform.batteryLevel);
		if (Titanium.Platform.batteryState == Titanium.Platform.BATTERY_STATE_CHARGING) {
			Ti.API.info('charging');
			Ti.App.Properties.setString('gps_level', 'High Power');
			self.update_gps_setting(1);// charging, then set
			// high power
		} else {// check level
			Ti.API.info('no charging');
			if (Titanium.Platform.batteryLevel > 0.5) {
				Ti.App.Properties.setString('gps_level', 'High Power');
				self.update_gps_setting(1);// if battery
				// level over
				// 50,
				// then use high power
			} else {
				if (Titanium.Platform.batteryLevel <= 0.2) {
					Ti.App.Properties.setString('gps_level', 'Lower Power');
					self.update_gps_setting(3);// lower
					// power
				} else {
					Ti.App.Properties.setString('gps_level', 'Medium Power');
					self.update_gps_setting(2);// medium
					// power
				}
			}
		}
		Titanium.Platform.batteryMonitoring = false;
		Titanium.Platform.removeEventListener('battery', function() {
		});
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.set_gps_level_by_battery_status');
		return;
	}
};
/**
 * update gps setting
 */
transaction_page.prototype.update_gps_setting = function(gps_index) {
	var self = this;
	try {
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
		if ((rows != null) && (rows.getRowCount() > 0)) {
			db.execute('UPDATE my_frontend_config_setting SET value=? WHERE name=?', gps_index, 'gps');
		} else {
			db.execute('INSERT into my_frontend_config_setting (value,name) VALUES(' + gps_index + ',\'gps\')');
		}
		rows.close();
		db.close();
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.update_gps_setting');
		return;
	}
};
/**
 * send user's location (lantitude and longitude) by gps
 */
transaction_page.prototype.send_gps_location = function() {
	var self = this;
	if (Ti.Network.online) {
		try {
			self.set_gps_level_by_battery_status();
			var user_id = Titanium.App.Properties.getString('current_login_user_id');
			if ((user_id === undefined) || (user_id === null) || (user_id === 0)) {
				return;
			}
			if (!Titanium.Geolocation.locationServicesEnabled) {
				return;
			} else {
				if (Titanium.Platform.name != 'android') {
					var authorization = Titanium.Geolocation.locationServicesAuthorization;
					if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
						return;
					} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
						return;
					}
				}
				if (Titanium.Geolocation.hasCompass) {
					//
					// TURN OFF ANNOYING COMPASS
					// INTERFERENCE MESSAGE
					//
					Titanium.Geolocation.showCalibration = false;
					//
					// SET THE HEADING FILTER (THIS IS IN
					// DEGREES OF ANGLE CHANGE)
					// EVENT WON'T FIRE UNLESS ANGLE CHANGE
					// EXCEEDS THIS VALUE
					Titanium.Geolocation.headingFilter = 180;
				} else {
					Titanium.API.info("No Compass on device send");
				}	
				var selectedGPSIndex = 0, selectedGPSType = 1, selectedGPSInterval, selectedGPSDistance, selectedGPSAccuracy;
				var db = Titanium.Database.open(self.get_db_name());
				var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
				if (rows.isValidRow()) {
					selectedGPSIndex = parseInt(rows.fieldByName('value'), 10);
					Ti.API.info('selectedGPSInterval title:' + self.gps_settings[selectedGPSIndex - 1].title);
					selectedGPSType = self.gps_settings[selectedGPSIndex - 1].type;
					selectedGPSInterval = self.gps_settings[selectedGPSIndex - 1].interval;
					selectedGPSDistance = self.gps_settings[selectedGPSIndex - 1].distance;
					selectedGPSAccuracy = self.gps_settings[selectedGPSIndex - 1].accuracy;
				}
				rows.close();
				db.close();
				Ti.API.info('selectedGPSIndex:' + selectedGPSIndex);
				Ti.API.info('selectedGPSType:' + selectedGPSType);
				Ti.API.info('selectedGPSInterval:' + selectedGPSInterval);
				
				Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
				Titanium.Geolocation.purpose = "GPS";
				if (selectedGPSIndex <= 0) {
					Titanium.Geolocation.distanceFilter = 50;
					Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
				} else {
					Ti.API.info('selectedGPSDistance:' + selectedGPSDistance);
					Titanium.Geolocation.distanceFilter = selectedGPSDistance;
					Titanium.Geolocation.accuracy = selectedGPSAccuracy;
				}
				switch (selectedGPSIndex){
					case 0:
					case 1:
						Ti.App.Properties.setString('gps_level', 'High Power');						
						break;
					case 2:
						Ti.App.Properties.setString('gps_level', 'Medium Power');
						break;
					case 3:
						Ti.App.Properties.setString('gps_level', 'Lower Power');
						break;
					case 4:
						Ti.App.Properties.setString('gps_level', 'GPS Off');
						break;
				}				
				self.get_location_event();
			}
		} catch (err) {
			self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.send_gps_location');
			return;
		}
	}
};
transaction_page.prototype.gps_turn_off_alert = function() {
	var self = this;
	try {
		// check gps is turn on or off.
		var authorization = Titanium.Geolocation.locationServicesAuthorization;
		if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
			var alertDialog = Titanium.UI.createAlertDialog({
				title : L('message_warning'),
				message : 'Your device\'s gps turned off. Please turn on it from Phone\'s Setting.\nStep 1 : Open Phone\'s Settings, select "Privacy" and click "Location Services"; \nStep 2 : Select "FieldTeam" and turn it on.',
				buttonNames : [ 'Close' ]
			});
			alertDialog.show();
			alertDialog.addEventListener('click', function(e) {
				// from ios5.1, apple remove url schema
				// function. so we can't use
				// Ti.Platform.openURL()';
				if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
					return;
				}
				return;
			});
		}
	} catch (err) {
		var params = {
			message : 'GPS turn off alert failed.',
			show_message : false,
			message_title : '',
			send_error_email : true,
			error_message : err,
			error_source : self.window_source + ' - transaction_page.prototype.gps_turn_off_alert',
			server_response_message : ''
		};
		self.processXYZ(params);
		return;
	}
};

transaction_page.prototype.get_location_event = function() {
	var self = this;
	try {
		Titanium.Geolocation.getCurrentPosition(function(e) {
			Ti.API.info('get_location_event  start');
			if (!e.success || e.error) {
				Ti.API.info('get_location_event error');
				return;
			}
			longitude = e.coords.longitude;
			latitude = e.coords.latitude;
			Ti.App.Properties.setString('job_start_stop_longitude', longitude);
			Ti.App.Properties.setString('job_start_stop_latitude', latitude);
			
			Ti.API.info('longitude:' + longitude);
			Ti.API.info('latitude:' + latitude);
			
			var selected_company_id = Ti.App.Properties.getString('current_company_id');
			Titanium.App.Properties.setBool('location_service_time_start', true);
			if ((longitude != 0) && (latitude != 0)) {
				var user_id = Titanium.App.Properties.getString('current_login_user_id');
				var new_date = new Date();
				var temp_year = new_date.getFullYear();
				var temp_month = new_date.getMonth() + 1;
				var temp_date = new_date.getDate();
				var temp_hours = new_date.getHours();
				var temp_minutes = new_date.getMinutes();
				var temp_seconds = new_date.getSeconds();
				var logged = temp_year + '-' + ((temp_month < 10) ? '0' + temp_month : temp_month) + '-' + ((temp_date < 10) ? '0' + temp_date : temp_date) + ' ' + ((temp_hours < 10) ? '0' + temp_hours : temp_hours) + ':' + ((temp_minutes < 10) ? '0' + temp_minutes : temp_minutes) + ':' + ((temp_seconds < 10) ? '0' + temp_seconds : temp_seconds);
				
				var xhr = null;
				if (self.set_enable_keep_alive) {
					xhr = Ti.Network.createHTTPClient({
						enableKeepAlive : false
					});
				} else {
					xhr = Ti.Network.createHTTPClient();
				}
				xhr.onload = function() {
					var d = new Date();
					// for avoid gap time is
					// double of 5 mins,
					// this value need to
					// reduce 30seconds
					// Ti.API.info('new -
					// location_service_time:'+
					// d.getTime() - (30000));
					Ti.App.Properties.setString('location_service_time', d.getTime());
					Titanium.App.Properties.setBool('location_service_time_start', false);
				};
				xhr.onerror = function(e) {
					Ti.API.info('new - location_service_time2 error:');
					Titanium.App.Properties.setBool('location_service_time_start', false);
					// avoid to send gps
					// error email. (if
					// happen timeout error)
					var isPass = true;
					if ((self.getObjectSource(e).indexOf('The request timed out') == -1) && (self.getObjectSource(e).indexOf('A connection failure occurred') == -1)) {
						isPass = false;
					}
					if (!isPass) {
						var params = {
							message : 'Update geo location failed.',
							show_message : false,
							message_title : '',
							send_error_email : true,
							error_message : e,
							error_source : self.window_source + ' - transaction_page.prototype.get_location_event - xhr.onerror',
							server_response_message : this.reponseText
						};
						self.processXYZ(params);
					}
					return;
				};
				xhr.setTimeout(self.default_time_out);
				xhr.open('POST', self.get_host_url() + 'update', true);
				xhr.send({
					'type' : 'update_geo_location',
					'hash' : user_id,
					'company_id' : selected_company_id,
					'longitude' : longitude,
					'latitude' : latitude,
					'logged' : logged,
					'manager_user_id' : user_id,
					'battery_status' : Ti.App.Properties.getString('battery_status'),
					'battery_level' : Ti.App.Properties.getString('battery_level') + ' from get',
					'gps_level' : Ti.App.Properties.getString('gps_level'),
					'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id
				});
			}
			
		});
	} catch (err) {
		Titanium.App.Properties.setBool('location_service_time_start', false);
		var isPass = true;
		if ((self.getObjectSource(e).indexOf('NSLocalizedDescription=The request timed out') == -1) && (self.getObjectSource(e).indexOf('NSLocalizedDescription=A connection failure occurred') == -1)) {
			isPass = false;
		}
		if (!isPass) {
			self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.get_location_event');
		}
		return;
	}
};
transaction_page.prototype.add_location_event = function() {
	var self = this;
	try {
		Titanium.Geolocation.addEventListener('location', function(e) {
			var longitude = 0;
			var latitude = 0;
			Ti.API.info('add_location_event  start');
			Ti.API.info('send_gps_location1',Ti.App.Properties.getString('send_gps_location1:'));
			Ti.API.info('send_gps_location2',Ti.App.Properties.getString('send_gps_location2:'));
			Ti.API.info('send_gps_location3',Ti.App.Properties.getString('send_gps_location3:'));
			if ((Ti.Platform.model == 'x86_64') || (Ti.Platform.model == 'Simulator')) {
				// fake location
				longitude = '151.209014892578100';
				latitude = '-33.865989685058590';
			} else {
				// get real location
				if (!e.success || e.error) {
					Ti.API.info('t9');
					return;
				}
				longitude = e.coords.longitude;
				latitude = e.coords.latitude;
			}
			Ti.App.Properties.setString('job_start_stop_longitude', longitude);
			Ti.App.Properties.setString('job_start_stop_latitude', latitude);
			
			Ti.API.info('longitude:' + longitude);
			Ti.API.info('latitude:' + latitude);
			
			Titanium.App.Properties.setBool('location_service_time_start', true);
			if ((longitude != 0) && (latitude != 0)) {
				var selected_company_id = Ti.App.Properties.getString('current_company_id');
				var user_id = Titanium.App.Properties.getString('current_login_user_id');
				var new_date = new Date();
				var temp_year = new_date.getFullYear();
				var temp_month = new_date.getMonth() + 1;
				var temp_date = new_date.getDate();
				var temp_hours = new_date.getHours();
				var temp_minutes = new_date.getMinutes();
				var temp_seconds = new_date.getSeconds();
				var logged = temp_year + '-' + ((temp_month < 10) ? '0' + temp_month : temp_month) + '-' + ((temp_date < 10) ? '0' + temp_date : temp_date) + ' ' + ((temp_hours < 10) ? '0' + temp_hours : temp_hours) + ':' + ((temp_minutes < 10) ? '0' + temp_minutes : temp_minutes) + ':' + ((temp_seconds < 10) ? '0' + temp_seconds : temp_seconds);
				
				var xhr = null;
				if (self.set_enable_keep_alive) {
					xhr = Ti.Network.createHTTPClient({
						enableKeepAlive : false
					});
				} else {
					xhr = Ti.Network.createHTTPClient();
				}
				xhr.onload = function() {
					var d = new Date();
					Ti.App.Properties.setString('location_service_time', d.getTime());
					Titanium.App.Properties.setBool('location_service_time_start', false);
				};
				xhr.onerror = function(e) {
					Titanium.App.Properties.setBool('location_service_time_start', false);
					// avoid to send gps error email. (if
					// happen timeout error)
					var isPass = true;
					if ((self.getObjectSource(e).indexOf('The request timed out') == -1) && (self.getObjectSource(e).indexOf('A connection failure occurred') == -1)) {
						isPass = false;
					}
					if (!isPass) {
						var params = {
							message : 'Update geo location failed.',
							show_message : false,
							message_title : '',
							send_error_email : true,
							error_message : e,
							error_source : self.window_source + ' - transaction_page.prototype.add_location_event - xhr.onerror',
							server_response_message : this.reponseText
						};
						self.processXYZ(params);
					}
					return;
				};
				xhr.setTimeout(self.default_time_out);
				xhr.open('POST', self.get_host_url() + 'update', true);
				xhr.send({
					'type' : 'update_geo_location',
					'hash' : user_id,
					'company_id' : selected_company_id,
					'longitude' : longitude,
					'latitude' : latitude,
					'logged' : logged,
					'manager_user_id' : user_id,
					'battery_status' : Ti.App.Properties.getString('battery_status'),
					'battery_level' : Ti.App.Properties.getString('battery_level'),
					'gps_level' : Ti.App.Properties.getString('gps_level'),
					'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id
				});
			}
		});
	} catch (err) {
		Titanium.App.Properties.setBool('location_service_time_start', false);
		var isPass = true;
		if ((self.getObjectSource(e).indexOf('NSLocalizedDescription=The request timed out') == -1) && (self.getObjectSource(e).indexOf('NSLocalizedDescription=A connection failure occurred') == -1)) {
			isPass = false;
		}
		if (!isPass) {
			self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.add_location_event');
		}
		return;
	}
};
/**
 * async upload (if upload_status=0, then upload, otherwise wait)
 */
transaction_page.prototype.run_in_background_for_sync_upload = function() {
	var self = this;
	try {
		if (Ti.Network.online) {
			var upload_media_file_flag = Ti.App.Properties.getBool('upload_media_file_flag');
			if (!upload_media_file_flag) {
				Ti.App.Properties.setBool('upload_media_file_flag', true);
				var db = Titanium.Database.open(self.get_db_name());
				// db.execute('DELETE FROM my_updating_records
				// WHERE upload_status=2');
				var rows = db.execute('SELECT * FROM my_updating_records WHERE upload_status=1 order by id asc limit 1');
				if (rows.isValidRow()) {
					var temp_var = {
						type : rows.fieldByName('type'),
						path : '',
						message : rows.fieldByName('message'),
						error_message : rows.fieldByName('error_message'),
						user_id : rows.fieldByName('user_id'),
						company_id : rows.fieldByName('company_id'),
						table_name : rows.fieldByName('table_name'),
						updating_id : rows.fieldByName('updating_id'),
						updating_record_id : rows.fieldByName('id'),
						failure_times : rows.fieldByName('failure_times'),
						relation_id : rows.fieldByName('relation_id'),
						relation_reference_number : rows.fieldByName('relation_reference_number'),
						relation_id_field_name : rows.fieldByName('relation_id_field_name'),
						relation_table : rows.fieldByName('relation_table')
					};
					rows.close();
					db.close();
					// adjust the position of dashboard
					if (Ti.Network.online) {
						
						self.check_job_media_file_exist(temp_var);
						
					} else {
						Ti.App.Properties.setBool('upload_media_file_flag', false);
					}
				} else {
					
					rows.close();
					rows = db.execute('SELECT * FROM my_updating_records WHERE upload_status=0 order by id asc limit 1');
					// if exist records, then start
					var temp_id = 0;
					if (rows.isValidRow()) {
						temp_id = rows.fieldByName('id');
						temp_var = {
							type : rows.fieldByName('type'),
							path : '',
							message : rows.fieldByName('message'),
							error_message : rows.fieldByName('error_message'),
							user_id : rows.fieldByName('user_id'),
							company_id : rows.fieldByName('company_id'),
							table_name : rows.fieldByName('table_name'),
							updating_id : rows.fieldByName('updating_id'),
							updating_record_id : rows.fieldByName('id'),
							failure_times : rows.fieldByName('failure_times'),
							relation_id : rows.fieldByName('relation_id'),
							relation_reference_number : rows.fieldByName('relation_reference_number'),
							relation_id_field_name : rows.fieldByName('relation_id_field_name'),
							relation_table : rows.fieldByName('relation_table')
						};
						rows.close();
						db.execute('UPDATE my_updating_records SET upload_status=1 WHERE id=?', temp_id);
						db.close();
						// adjust the position of
						// dashboard
						if (Ti.Network.online) {
							self.check_job_media_file_exist(temp_var);
						} else {
							Ti.App.Properties.setBool('upload_media_file_flag', false);
						}
					} else {
						
						rows.close();
						Ti.App.Properties.setBool('upload_media_file_flag', false);
						rows = db.execute('SELECT * FROM my_updating_records_for_data order by id asc');
						if (rows.getRowCount() > 0) {
							while (rows.isValidRow()) {
								var temp_row = db.execute('SELECT * FROM my_updating_records where id=?', rows.fieldByName('id'));
								if ((temp_row != null) && (temp_row.isValidRow())) {
									temp_row.close();
								} else {
									temp_row.close();
									Ti.API.info('c3:' + rows.fieldByName('updating_id'));
									db.execute('INSERT INTO my_updating_records (id,user_id,company_id,type,failure_times,upload_status,message,error_message,updating_id,table_name,relation_id,relation_reference_number,relation_id_field_name,relation_table,created)' + 'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', rows.fieldByName('id'), rows.fieldByName('user_id'), rows.fieldByName('company_id'), rows.fieldByName('type'), rows.fieldByName('failure_times'), rows
													.fieldByName('upload_status'), rows.fieldByName('message'), rows.fieldByName('error_message'), rows.fieldByName('updating_id'), rows.fieldByName('table_name'), rows.fieldByName('relation_id'), rows.fieldByName('relation_reference_number'), rows.fieldByName('relation_id_field_name'), rows.fieldByName('relation_table'), rows.fieldByName('created'));
								}
								rows.next();
							}
							rows.close();
							db.execute('DELETE from my_updating_records_for_data');
							db.close();
							setTimeout(function() {
								self.run_in_background_for_sync_upload();
							}, 1000);
						} else {
							Ti.App.Properties.setBool('upload_media_file_flag', false);
							rows.close();
							db.close();
						}
					}
				}
			}
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.run_in_background_for_sync_upload');
		setTimeout(function() {
			Ti.App.Properties.setBool('upload_media_file_flag', false);
			self.run_in_background_for_sync_upload();
		}, 1000);
		return;
	}
};

transaction_page.prototype.check_job_media_file_exist = function(params) {
	var self = this;
	try {
		var temp_flag = false;
		var db = Titanium.Database.open(self.get_db_name());
		// get record which need to upload server
		var temp_row = db.execute('SELECT * FROM ' + params.table_name + ' WHERE local_id=?', params.updating_id);
		if ((temp_row.getRowCount() > 0) && (temp_row.isValidRow())) {
			temp_flag = true;
			var temp_path_original = ((temp_row.fieldByName('path') === null) || (temp_row.fieldByName('path') === '')) ? temp_row.fieldByName('path_original') : temp_row.fieldByName('path');
		}
		temp_row.close();
		db.close();
		
		if (temp_flag) {
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {					
					if ((xhr.readyState === 4) && (this.status === 200)) {
						if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
							return;
						}
						var temp_result = JSON.parse(this.responseText);
						if (!temp_result.result) {
							
							self.upload_job_media_file(params);
						} else {
							
							self.clean_table_after_uploaded(params, true);
						}
					} else {
						var error_params = {
							message : 'Check asset file failed.',
							show_message : false,
							message_title : '',
							send_error_email : true,
							error_message : '',
							error_source : self.window_source + ' - transaction_page.prototype.check_job_media_file_exist - xhr.onload - 1',
							server_response_message : this.reponseText
						};
						self.processXYZ(error_params);
						self.clean_table_after_uploaded(params, false);
					}
				} catch (e) {
					error_params = {
						message : 'Check asset file failed.',
						show_message : false,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.check_job_media_file_exist - xhr.onload - 2',
						server_response_message : this.reponseText
					};
					self.processXYZ(error_params);
					self.clean_table_after_uploaded(params, false);
				}
			};
			xhr.onerror = function(e) {
				var error_params = {
					message : 'Check asset file failed.',
					show_message : false,
					message_title : '',
					send_error_email : true,
					error_message : e,
					error_source : self.window_source + ' - transaction_page.prototype.check_job_media_file_exist - xhr.onerror',
					server_response_message : this.reponseText
				};
				self.processXYZ(error_params);
				self.clean_table_after_uploaded(params, false);
			};
			xhr.setTimeout(self.default_time_out);
			xhr.open('POST', self.get_host_url() + 'update', true);
			xhr.send({
				'type' : 'check_asset_file_exist',
				'host' : self.get_host(),
				'hash' : params.user_id,
				'company_id' : params.company_id,
				'path' : temp_path_original,
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		} else {
			self.clean_table_after_uploaded(params, false);
		}
	} catch (err) {
		error_params = {
			message : 'Check asset file failed.',
			show_message : false,
			message_title : '',
			send_error_email : true,
			error_message : err,
			error_source : self.window_source + ' - transaction_page.prototype.check_job_media_file_exist',
			server_response_message : ''
		};
		self.processXYZ(error_params);
		self.clean_table_after_uploaded(params, false);
		return;
	}
};
/**
 * upload job operation log info
 */
transaction_page.prototype.upload_job_media_file = function(params) {
	var self = this;
	try {
		var temp_flag = false;
		var db = Titanium.Database.open(self.get_db_name());
		// get record which need to upload server
		var temp_row = db.execute('SELECT * FROM ' + params.table_name + ' WHERE local_id=?', params.updating_id);
		if ((temp_row.getRowCount() > 0) && (temp_row.isValidRow())) {
			temp_flag = true;
			var temp_table_name = params.table_name;
			var temp_mime_type = temp_row.fieldByName('mime_type');
			var temp_width = temp_row.fieldByName('width');
			var temp_height = temp_row.fieldByName('height');
			var temp_file_size = temp_row.fieldByName('file_size');
			var temp_status_code = temp_row.fieldByName('status_code');
			var temp_path_original = ((temp_row.fieldByName('path') === null) || (temp_row.fieldByName('path') === '')) ? temp_row.fieldByName('path_original') : temp_row.fieldByName('path');
		}
		temp_row.close();
		db.close();
		if (temp_flag) {
			var is_exist_media_file = false;
			var temp_arr = temp_path_original.split('/');
			var folder_name = '';
			for ( var i = 0, j = temp_arr.length - 1; i < j; i++) {
				if (i === 0) {
					folder_name += temp_arr[i];
				} else {
					folder_name += '/' + temp_arr[i];
				}
			}
			var file_name = temp_arr[temp_arr.length - 1];
			var mediafile = Ti.Filesystem.getFile(self.file_directory + folder_name, file_name);
			if (mediafile.exists()) {
				is_exist_media_file = true;
			}
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {
					if ((xhr.readyState === 4) && (this.status === 200)) {
						Ti.API.info('upload_job_media_file this.responseText:'+this.responseText);
						var temp_result = JSON.parse(this.responseText);
						if ((temp_result.error != undefined) && (temp_result.error.length > 0)) {
							var error_string = '';
							for ( var i = 0, j = temp_result.error.length; i < j; i++) {
								if (i == j) {
									error_string += temp_result.error[i];
								} else {
									error_string += temp_result.error[i] + '\n';
								}
							}
							self.clean_table_after_uploaded(params, false);
						} else {
							if (!temp_result.result) {
								self.clean_table_after_uploaded(params, false);
							} else {
								self.clean_table_after_uploaded(params, true);
							}
						}
					} else {
						var error_params = {
							message : 'Upload asset file failed.',
							show_message : false,
							message_title : '',
							send_error_email : true,
							error_message : '',
							error_source : self.window_source + ' - transaction_page.prototype.upload_job_media_file - xhr.onload - 1',
							server_response_message : this.reponseText
						};
						self.processXYZ(error_params);
						self.clean_table_after_uploaded(params, false);
					}
				} catch (e) {
					error_params = {
						message : 'Upload asset file failed.',
						show_message : false,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.upload_job_media_file - xhr.onload - 2',
						server_response_message : this.reponseText
					};
					self.processXYZ(error_params);
					self.clean_table_after_uploaded(params, false);
				}
			};
			xhr.onerror = function(e) {
				var error_params = {
					message : 'Upload asset file failed.',
					show_message : false,
					message_title : '',
					send_error_email : true,
					error_message : e,
					error_source : self.window_source + ' - transaction_page.prototype.upload_job_media_file - xhr.onerror',
					server_response_message : this.reponseText
				};
				self.processXYZ(error_params);
				self.clean_table_after_uploaded(params, false);
			};
			xhr.setTimeout(self.default_download_time_out);
			xhr.open('POST', self.get_host_url() + 'update', true);
			xhr.send({
				'type' : 'upload_asset_file',
				'media' : (is_exist_media_file) ? mediafile.read() : '',
				'host' : self.get_host(),
				'hash' : params.user_id,
				'company_id' : params.company_id,
				'path' : temp_path_original,
				'mime_type' : temp_mime_type,
				'table_name' : temp_table_name,
				'width' : temp_width,
				'height' : temp_height,
				'file_size' : temp_file_size,
				'status_code' : temp_status_code,
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		} else {
			self.clean_table_after_uploaded(params, false);
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.upload_job_media_file');
		self.clean_table_after_uploaded(params, false);
		return;
	}
};
/**
 * 1. set upload_status = 2 if success, else set upload_status = 3;
 */
transaction_page.prototype.clean_table_after_uploaded = function(params, is_success) {
	var self = this;
	try {
		// remove uploaded records from some tables
		var db = Titanium.Database.open(self.get_db_name());
		if (!is_success) {
			var temp_row = db.execute('SELECT * FROM my_updating_records WHERE id=?', params.updating_record_id);
			if (temp_row.isValidRow()) {
				if (parseInt(temp_row.fieldByName('failure_times'), 10) >= 1) {
					db.execute('UPDATE my_updating_records SET upload_status=3 WHERE id=?', params.updating_record_id);
				} else {
					db.execute('UPDATE my_updating_records SET failure_times=failure_times+1 WHERE id=?', params.updating_record_id);
				}
			}
			temp_row.close();
		} else {
			db.execute('UPDATE my_updating_records SET upload_status=2 WHERE id=?', params.updating_record_id);
		}
		db.close();
		Ti.App.fireEvent('refresh_badge_for_main_page');
		setTimeout(function() {
			Ti.App.Properties.setBool('upload_media_file_flag', false);
			self.run_in_background_for_sync_upload();
		}, 1000);
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.clean_table_after_uploaded');
		Ti.App.fireEvent('refresh_badge_for_main_page');
		setTimeout(function() {
			Ti.App.Properties.setBool('upload_media_file_flag', false);
			self.run_in_background_for_sync_upload();
		}, 1000);
		return;
	}
};

/**
 * upload job operation log info
 */
transaction_page.prototype.check_if_exist_upload_file_failure = function(job_id, type, company_id) {
	var self = this;
	try {
		var result = false;// no exist
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('select * from my_updating_records where relation_id=? and type=? and company_id=?', job_id, type, company_id);
		if (rows.getRowCount() > 0) {
			result = true;
		}
		db.close();
		return result;
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.check_if_exist_upload_file_failure');
		return false;
	}
};
transaction_page.prototype.local_notification_if_upload_media_file_failed = function() {
	var self = this;
	try {
		// check if in background service
		var is_bg_service = Ti.App.Properties.getBool('is_in_background_service');
		if (is_bg_service == undefined || is_bg_service == null) {
			return;
		}
		// check if in display alert (upload file failed.)
		var is_displaying_file_upload_failed_alert = Ti.App.Properties.getBool('is_displaying_file_upload_failed_alert');
		if (is_displaying_file_upload_failed_alert == undefined || is_displaying_file_upload_failed_alert == null) {
			is_displaying_file_upload_failed_alert = false;
		}
		if (is_bg_service == false && is_displaying_file_upload_failed_alert == true) {
			return;
		}
		// remove uploaded records from some tables
		var selected_company_id = Ti.App.Properties.getString('current_company_id');
		var db = Titanium.Database.open(self.get_db_name());
		var job_reference_number_array = [], quote_reference_number_array = [];
		var temp_row = db.execute('SELECT distinct(relation_reference_number) FROM my_updating_records WHERE upload_status=3 and company_id=? and type=\'job\' order by relation_reference_number desc', selected_company_id);
		while (temp_row.isValidRow()) {
			job_reference_number_array.push('#' + temp_row.fieldByName('relation_reference_number'));
			temp_row.next();
		}
		temp_row.close();
		
		temp_row = db.execute('SELECT distinct(relation_reference_number) FROM my_updating_records WHERE upload_status=3 and company_id=? and type=\'quote\' order by relation_reference_number desc', selected_company_id);
		while (temp_row.isValidRow()) {
			quote_reference_number_array.push('#' + temp_row.fieldByName('relation_reference_number'));
			temp_row.next();
		}
		temp_row.close();
		db.close();
		var message = '';
		if (job_reference_number_array.length > 0) {
			message += 'Job No. :' + job_reference_number_array.join(',');
		}
		if (quote_reference_number_array.length > 0) {
			if (message == '') {
				message += '';
			} else {
				message += '.\n';
			}
			message += 'Quote No. :' + quote_reference_number_array.join(',');
		}
		if (message != '') {
			message += '.';
			if (is_bg_service) {
				Ti.App.iOS.scheduleLocalNotification({
					alertBody : message,
					alertAction : "Re-Launch!",
					userInfo : {
						"FieldTeam" : "File Upload Failed"
					},
					sound : "pop.caf",
					date : new Date(new Date().getTime() + 3000)
				// 3
				// seconds
				// after
				// backgrounding
				});
			} else {
				Ti.App.Properties.setBool('is_displaying_file_upload_failed_alert', true);
				self.show_file_upload_failed_alert(message, 'Files Upload Failed');
			}
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.local_notification_if_upload_media_file_failed');
		return;
	}
};

/**
 * get all job id string or all quote id string. (notes, these jobs and quotes
 * have been download to local already)
 */
transaction_page.prototype.get_existed_job_or_quote_id_string = function(temp_type, company_id) {
	var self = this;
	try {
		var temp_id_array = [];
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('SELECT distinct(id) FROM my_' + temp_type + ' WHERE company_id=? and id< 1000000000', company_id);
		if (rows.getRowCount() > 0) {
			while (rows.isValidRow()) {
				temp_id_array.push(rows.fieldByName('id'));
				rows.next();
			}
		}
		rows.close();
		db.close();
		if (temp_id_array.length > 0) {
			return temp_id_array.join(',');
		} else {
			return '';
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.get_existed_job_or_quote_id_string');
		return '';
	}
};

/**
 * get all job id string or all quote id string by selected date. (notes, these
 * jobs and quotes have been download to local already)
 */
transaction_page.prototype.get_existed_job_or_quote_id_string_by_selected_date_and_user_id = function(temp_type, company_id, date, manager_user_id) {
	var self = this;
	try {
		var temp_id_array = [];
		var temp_start_value = date + ' 00:00:00';
		var temp_end_value = date + ' 23:59:59';
		var temp_day_type = temp_type;
		var sql_params = {
			is_task : false,
			is_calendar : true,// in calendar or in filter
			is_scheduled : true,// query assigned_from is not
			// null
			is_check_changed : false,// check changed field
			// or not
			is_check_self_job : true,// only check current
			// user's job
			order_by : 'my_' + temp_day_type + '_assigned_user.assigned_from desc',
			is_search : false,
			search_string : '',
			extra_left_join_condition : '(' + '(my_' + temp_day_type + '_assigned_user.assigned_from <=\'' + temp_end_value + '\' and my_' + temp_day_type + '_assigned_user.assigned_to >=\'' + temp_start_value + '\') or ' + '(my_' + temp_day_type + '_assigned_user.assigned_from <=\'' + temp_end_value + '\' and my_' + temp_day_type + '_assigned_user.assigned_to >=\'' + temp_end_value + '\') or ' + '(my_' + temp_day_type + '_assigned_user.assigned_from >=\'' + temp_start_value
							+ '\' and my_' + temp_day_type + '_assigned_user.assigned_from <=\'' + temp_end_value + '\') ' + ')',
			extra_where_condition : '',
			type : temp_day_type,
			user_id : manager_user_id,
			company_id : company_id,
			job_status_code : -1
		};
		
		var sql = self.setup_sql_query_for_display_job_list(sql_params);
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute(sql);
		self.my_selected_job_number = rows.getRowCount();
		if (rows.getRowCount() > 0) {
			while (rows.isValidRow()) {
				temp_id_array.push(rows.fieldByName('id'));
				rows.next();
			}
		}
		rows.close();
		db.close();
		temp_id_array = self.get_unique_array(temp_id_array);
		if (temp_id_array.length > 0) {
			return temp_id_array.join(',');
		} else {
			return '';
		}
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.get_existed_job_or_quote_id_string_by_selected_date_and_user_id');
		return '';
	}
};
/*
 * merage the features: download_latest_log and
 * begin_download_more_jobs_by_scroll_down avoid insert database constaint
 * error;
 */
transaction_page.prototype.download_latest_log_and_download_more_jobs = function() {
	var self = this;
	try {
		if (Ti.Network.online) {
			// if os is downloading latest log then return
			var db = Titanium.Database.open(self.get_db_name());
			var library_last_updated = 0;
			var rows = db.execute('SELECT * FROM my_frontend_config_setting where name=?', 'library_last_updated');
			if ((rows.getRowCount() > 0) && (rows.isValidRow())) {
				library_last_updated = parseInt(rows.fieldByName('value'), 10);
				var library_last_updated2 = parseInt(Titanium.App.Properties.getString('library_last_updated'), 10);
				if (library_last_updated2 != library_last_updated) {
					library_last_updated = library_last_updated2;
				}
			}
			rows.close();
			db.close();
			
			var selected_company_id = Ti.App.Properties.getString('current_company_id');
			var selected_login_user_id = Ti.App.Properties.getString('current_login_user_id');
			
			self.get_extra_conditions_when_download_more_jobs();
			
			var xhr = null;
			if (self.set_enable_keep_alive) {
				xhr = Ti.Network.createHTTPClient({
					enableKeepAlive : false
				});
			} else {
				xhr = Ti.Network.createHTTPClient();
			}
			xhr.onload = function() {
				try {
					if ((xhr.readyState === 4) && (this.status === 200)) {
						if (self.return_to_login_page_if_user_security_session_changed(this.responseText)) {
							return;
						}
						if (self.display_app_version_incompatiable(this.responseText)) {
							self.end_download_more_jobs_by_scroll_down(true);
							return;
						}
						self.refresh_job_and_relative_tables(this.responseText, 'top');
						Ti.App.Properties.setBool('lock_table_flag', false);
						self.end_download_more_jobs_by_scroll_down(true);
					} else {
						Ti.App.Properties.setBool('lock_table_flag', false);
						self.end_download_more_jobs_by_scroll_down(true);
						var params = {
							message : 'Download latest log and more jobs failed.',
							show_message : true,
							message_title : '',
							send_error_email : true,
							error_message : e,
							error_source : self.window_source + ' - transaction_page.prototype.download_latest_log_and_download_more_jobs - xhr.onload - 1',
							server_response_message : this.reponseText
						};
						self.processXYZ(params);
					}
				} catch (e) {
					Ti.App.Properties.setBool('lock_table_flag', false);
					self.end_download_more_jobs_by_scroll_down(true);
					params = {
						message : 'Download latest log and more jobs failed.',
						show_message : true,
						message_title : '',
						send_error_email : true,
						error_message : e,
						error_source : self.window_source + ' - transaction_page.prototype.download_latest_log_and_download_more_jobs - xhr.onload - 2',
						server_response_message : this.reponseText
					};
					self.processXYZ(params);
					return;
				}
			};
			xhr.onerror = function(e) {
				Ti.App.Properties.setBool('lock_table_flag', false);
				self.end_download_more_jobs_by_scroll_down(true);
				var params = {
					message : 'Download latest log and more jobs failed.',
					show_message : true,
					message_title : '',
					send_error_email : true,
					error_message : e,
					error_source : self.window_source + ' - transaction_page.prototype.download_latest_log_and_download_more_jobs - xhr.onerror',
					server_response_message : this.reponseText
				};
				self.processXYZ(params);
				return;
			};
			xhr.setTimeout(self.default_time_out);
			xhr.open('POST', self.get_host_url() + 'update', false);
			xhr.send({
				'type' : 'download_latest_log_and_download_more_jobs',
				'library_last_updated' : library_last_updated,
				'company_id' : selected_company_id,
				'user_id' : self.selected_user_id,
				'hash' : selected_login_user_id,
				'existed_job_id_string' : self.existed_job_id_string,
				'existed_quote_id_string' : self.existed_quote_id_string,
				'is_exist_search_text' : false,// query by
				// search text
				'is_exist_query_field' : false,// query fixed
				// field,e.g.
				// reference_number
				// or strta plan
				'job_extra_where' : self.job_extra_where,
				'job_type' : self.download_type,
				'view_type' : self.view_name,
				'date' : self.calendar_year + '-' + (((self.calendar_month + 1) <= 9) ? '0' + (self.calendar_month + 1) : (self.calendar_month + 1)) + '-' + ((self.calendar_date <= 9) ? '0' + self.calendar_date : self.calendar_date),
				'app_security_session' : self.is_simulator() ? self.default_udid : Titanium.Platform.id,
				'app_version_increment' : self.version_increment,
				'app_version' : self.version,
				'app_platform' : self.get_platform_info()
			});
		}
	} catch (err) {
		Ti.App.Properties.setBool('lock_table_flag', false);
		self.end_download_more_jobs_by_scroll_down(true);
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.download_latest_log_and_download_more_jobs');
		return '';
	}
};
/*
 * check user is login or logout status
 */
transaction_page.prototype.is_login_status = function() {
	var self = this;
	try {
		var result = false;
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('select * from  my_manager_user where local_login_status!=0');
		if (rows.getRowCount() > 0) {
			result = true;
		}
		rows.close();
		db.close();
		return result;
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.is_login_status');
		return false;
	}
};

transaction_page.prototype.show_file_upload_failed_alert = function(text, title) {
	var self = this;
	try {
		var alertDialog = Titanium.UI.createAlertDialog({
			title : (title === undefined) ? L('message_warning') : title,
			message : text,
			buttonNames : [ 'Close' ]
		});
		alertDialog.show();
		alertDialog.addEventListener('click', function(e) {
			Ti.App.Properties.setBool('is_displaying_file_upload_failed_alert', false);
		});
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.show_file_upload_failed_alert');
		return;
	}
};

transaction_page.prototype.get_gps_interval = function() {
	var self = this;
	try {
		// load gps interval from local database
		var selectedGPSIndex = 0, selectedGPSInterval = 0;
		var db = Titanium.Database.open(self.get_db_name());
		var rows = db.execute('SELECT * FROM my_frontend_config_setting WHERE name=?', 'gps');
		if (rows.isValidRow()) {
			selectedGPSIndex = parseInt(rows.fieldByName('value'), 10);
			selectedGPSInterval = self.gps_settings[selectedGPSIndex - 1].interval;
			Ti.API.info('bg selectedGPSInterval:' + selectedGPSInterval);
		}
		rows.close();
		db.close();
		return selectedGPSInterval;
	} catch (err) {
		self.process_simple_error_message(err, self.window_source + ' - transaction_page.prototype.get_gps_interval');
		return self.default_gps_location_update_interval;
	}
};
