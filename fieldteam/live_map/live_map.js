/**
 *  Description: living map, display user latest location.
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var live_map_page_obj = null;

        function live_map_page(){
                var Map = require('ti.map');  
                var self = this;
                var window_source = 'live_map_page';
                win.title = 'Mapping';
                
                //private member
                var _map_view = null;
                var _annotations = [];
                var _annotation = null;                
                //public method
                /**
                 *  override init function of parent class: transaction.js
                 */                   
                self.init = function(){
                        try{                           
                                self.init_auto_release_pool(win);
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Refresh','Main,Back');
                                self.display_indicator('Loading Data ...',true,false);                                
                                _refresh_map();
                                setTimeout(function(){
                                        self.hide_indicator();
                                },2000);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                                
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                   
                self.nav_right_btn_click_event = function(e){
                        try{
                                _refresh_map();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }  
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                        
                self.nav_left_btn_click_event = function(e){
                        try{           
                                _clean_annotations();
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }
                };   
                

                //public method
                function _refresh_map(){
                        try{                      
                                _clean_annotations();                            
                                _annotations = [];
                                var selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                                var selected_company_id = Ti.App.Properties.getString('current_company_id');
                                if(Ti.Network.online){
                                        var xhr = null;
                                        if(self.set_enable_keep_alive){
                                                xhr = Ti.Network.createHTTPClient({
                                                        enableKeepAlive:false
                                                });
                                        }else{
                                                xhr = Ti.Network.createHTTPClient();
                                        }
                                        xhr.onload = function(){
                                                try{
                                                        if((xhr.readyState === 4)&& (this.status === 200)){
                                                                if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                        return;
                                                                }                                                                 
                                                                if(self.display_app_version_incompatiable(this.responseText)){
                                                                        return;
                                                                }                                                                   
                                                        }
                                                        if((xhr.readyState != 4)||(this.status != 200)){
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'No Valid Data.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - _refresh_map - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                    
                                                                return;
                                                        }
                                                        if(this.responseText != '[]'){
                                                                var gps_result = _load_gps_data(this.responseText);                                                                                                                      
                                                                _map_view = Map.createView({
                                                                        mapType: Map.STANDARD_TYPE,
                                                                        region:{
                                                                                latitude:gps_result[gps_result.length-1].latitude,
                                                                                longitude:gps_result[gps_result.length-1].longitude,
                                                                                latitudeDelta:0.05, 
                                                                                longitudeDelta:0.05
                                                                        },
                                                                        animate:true,
                                                                        regionFit:true
                                                                });              
                                                                win.add(_map_view);
                                                                for(var i=0,j=gps_result.length;i<j;i++){
                                                                        _annotation = Map.createAnnotation({
                                                                                title:gps_result[i].username,
                                                                                subtitle:gps_result[i].interval,
                                                                                latitude:gps_result[i].latitude,
                                                                                longitude:gps_result[i].longitude,
                                                                                animate:true
                                                                        });
                                                                        _annotations.push(_annotation);
                                                                        _map_view.addAnnotations(_annotations);
                                                                        _annotation = null;
                                                                }                                                                                                                      
                                                        }else{
                                                                self.show_message('No Valid Data');  
                                                                return;
                                                        }
                                                }catch(e){
                                                        params = {
                                                                message:'No Valid Data.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - _refresh_map - xhr.onload - 2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                        
                                                        return;
                                                }
                                        };
                                        xhr.ondatastream = function(e){
                                                if(Ti.App.Properties.getBool('is_hide_indicator')){
                                                        Ti.App.Properties.setBool('is_hide_indicator',false);
                                                        if(xhr != undefined && xhr != null){
                                                                xhr.abort();
                                                        }                                        
                                                        self.hide_indicator();
                                                }
                                                self.update_progress(e.progress,true);
                                        };                                        
                                        xhr.onerror = function(e){
                                                var params = {
                                                        message:'No Valid Data.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _refresh_map - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);    
                                                return;
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'get_gps_location',
                                                'hash':selected_user_id,
                                                'company_id':selected_company_id,
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });
                                }else{
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));  
                                        return;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_map');
                                return;
                        }                                    
                }
                function _load_gps_data(responseText){
                        try{
                                Ti.API.info(responseText);                                
                                var result = JSON.parse(responseText);
                                var gps_data = result.gps_data;
                                if(gps_data == undefined || gps_data == null){
                                        return false;
                                }
                                var gps_array=[];
                                var current_user_id = parseInt(Ti.App.Properties.getString('current_login_user_id'),10);
                                var current_user_info = null;
                                var temp_array = null;
                                for(var i=0,j=gps_data.length;i<j;i++){
                                        if(current_user_id == gps_data[i].manager_user_id){
                                                current_user_info = {
                                                        'username':gps_data[i].username,
                                                        'latitude':gps_data[i].latitude,
                                                        'longitude':gps_data[i].longitude,
                                                        'created':gps_data[i].created,
                                                        'interval':gps_data[i].interval
                                                };
                                        }else{
                                                temp_array = {
                                                        'username':gps_data[i].username,
                                                        'latitude':gps_data[i].latitude,
                                                        'longitude':gps_data[i].longitude,
                                                        'created':gps_data[i].created,
                                                        'interval':gps_data[i].interval
                                                };
                                                gps_array.push(temp_array);
                                        }
                                }
                                if(current_user_info != null){
                                        gps_array.push(current_user_info);
                                }
                                return gps_array;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _load_gps_data');
                                return false;
                        }                                    
                }
                function _clean_annotations(){
                        try{
                                if(_map_view != null){
                                        _map_view.removeAllAnnotations();
                                        _map_view = null;
                                }
                                for(var i=0,j=_annotations.length;i<j;i++){
                                        _annotations[i] = null;
                                }                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _clean_annotations');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(live_map_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                live_map_page.prototype = new F();
                                live_map_page.prototype.constructor = live_map_page;
                                live_map_page_obj = new live_map_page();
                                live_map_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        live_map_page_obj.close_window();
                        live_map_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                  
        });
}());




