(function() {
	Titanium.include(Ti.App.Properties.getString('base_folder_name') + 'transaction.js');
	var background_service_obj = null;
	var bg_gps_timer = null;
	var bg_update_latest_log_timer = null;
	function background_service() {
	}
	
	if (background_service_obj == null || background_service_obj == undefined) {
		var P = function() {
		};
		P.prototype = transaction_page.prototype;
		background_service.prototype = new P();
		background_service.prototype.constructor = background_service;
		background_service_obj = new background_service();
	}
	if (background_service_obj != null && background_service_obj != undefined) {
//		bg_gps_timer = setInterval(function() {
//			Ti.API.info("bg service1");
//			if (Ti.Network.online && background_service_obj.is_login_status()) {
//				Ti.API.info("bg service run1");
//				background_service_obj.send_gps_location();
//			}
//		}, background_service_obj.get_gps_interval());
		
		bg_update_latest_log_timer = setInterval(function() {
			Ti.API.info("bg_update_latest_log_timer1");
			if (Ti.Network.online && background_service_obj.is_login_status()) {
				Ti.API.info("bg_update_latest_log_timer run1");
				background_service_obj.download_latest_log();
				//background_service_obj.local_notification_if_upload_media_file_failed();
			}
//			var oldGPSInterval = parseInt(Ti.App.Properties.getString('gps_interval'), 10);
//			var newGPSInterval = background_service_obj.get_gps_interval();
//			if (oldGPSInterval != newGPSInterval) {
//				Ti.API.info('rebuild  gps timer in bg service');
//				if (bg_gps_timer != null) {
//					clearInterval(bg_gps_timer);
//					bg_gps_timer = null;
//					
//					bg_gps_timer = setInterval(function() {
//						if (Ti.Network.online && background_service_obj.is_login_status()) {
//							background_service_obj.send_gps_location();
//						}
//					}, newGPSInterval);					
//				}
//			}
		}, background_service_obj.default_data_update_interval);
	}
}());