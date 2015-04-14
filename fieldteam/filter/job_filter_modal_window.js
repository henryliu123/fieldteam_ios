/**
 *  Description: job query field and user can enter query value
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;    
        var filter_job_filter_model_window_page_obj = null;

        function filter_job_filter_model_window_page(){
                var self = this;
                var window_source = 'filter_job_filter_model_window_page';
                win.title = win.title_value;

                //public method
                /**
                 *  override init function of parent class: transaction.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');
                                //call init_table_view function of parent class: fieldteam.js
                                if(!self.is_ios_7_plus()){
                                        _init_query_value_text_field();
                                        self.init_table_view();
                                }else{
                                        _init_query_value_text_field_for_ios7();
                                }
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
                                self.query_field.blur();
                                if((_query_value === '')||(_query_value === null)){
                                        self.show_message('please enter value.');
                                        return; 
                                }else{
                                        if((_filter_class === 'find_job_number') || (_filter_class === 'find_quote_number')){
                                                if(isNaN(_query_value)){
                                                        self.show_message('Please enter '+_type+' number.');
                                                        return; 
                                                }
                                        }
                                        //search server for finding result number
                                        switch(_filter_class){
                                                case 'find_job_number':
                                                case 'find_quote_number':
                                                case 'find_job_strata_plan_number':                                              
                                                case 'find_quote_strata_plan_number':  
                                                case 'find_job_address':
                                                case 'find_quote_address':
                                                case 'find_job_order_reference_number':
                                                case 'find_quote_order_reference_number':       
                                                case 'find_job_title':
                                                case 'find_quote_title':
                                                        if(Ti.Network.online){
                                                                self.display_indicator('Loading Data ...');
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
                                                                                if((xhr.readyState === 4)&&(this.status === 200)){
                                                                                        if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                                                return;
                                                                                        }                                                                                         
                                                                                        if(self.display_app_version_incompatiable(this.responseText)){
                                                                                                return;
                                                                                        }                                                                                        
                                                                                        var result = JSON.parse(this.responseText);
                                                                                        var total_search_result = result.search_by_conditions[0].search_result;
                                                                                        self.hide_indicator();
                                                                                        var new_win = Ti.UI.createWindow({
                                                                                                url:self.get_file_path('url', 'filter/job_filter.js'),
                                                                                                pull_down_refresh:true,
                                                                                                filter_class:_filter_class,
                                                                                                filter_code:win.filter_code,
                                                                                                query_field:_query_field,
                                                                                                query_value:_query_value,
                                                                                                type:_type,
                                                                                                code:-1,
                                                                                                total_search_result:total_search_result
                                                                                        });
                                                                                        Ti.UI.currentTab.open(new_win,{
                                                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                                        });                                                                                         
                                                                                }else{ 
                                                                                        self.hide_indicator();
                                                                                        var params = {
                                                                                                message:L('message_not_get_search_result_in_job_filter_model_window'),
                                                                                                show_message:true,
                                                                                                message_title:'',
                                                                                                send_error_email:true,
                                                                                                error_message:'',
                                                                                                error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload - 1',
                                                                                                server_response_message:this.responseText
                                                                                        };
                                                                                        self.processXYZ(params);                                                                                          
                                                                                        
                                                                                        return;
                                                                                }
                                                                        }catch(e){         
                                                                                self.hide_indicator();
                                                                                params = {
                                                                                        message:L('message_not_get_search_result_in_job_filter_model_window'),
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:e,
                                                                                        error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload - 2',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);                                                                                                                                                                  
                                                                                return;
                                                                        }
                                                                };
                                                                xhr.onerror = function(e){                                                                        
                                                                        self.hide_indicator();
                                                                        var params = {
                                                                                message:L('message_not_get_search_result_in_job_filter_model_window'),
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:e,
                                                                                error_source:window_source+' - self.nav_right_btn_click_event - xhr.onerror',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);                                                                          
                                                                        return;                                                
                                                                };
                                                                xhr.setTimeout(self.default_time_out);
                                                                xhr.open('POST',self.get_host_url()+'update',false);
                                                                xhr.send({
                                                                        'type':'search_by_conditions',
                                                                        'hash':_selected_user_id,
                                                                        'company_id':_selected_company_id,
                                                                        'user_id':_selected_user_id,
                                                                        'filter_class':_filter_class,
                                                                        'query_field':_query_field,
                                                                        'query_value':_query_value,
                                                                        'job_type':win.type,
                                                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                        'app_version_increment':self.version_increment,
                                                                        'app_version':self.version,
                                                                        'app_platform':self.get_platform_info()
                                                                });     
                                                        }else{
                                                                self.show_message(L('message_offline_in_job_filter_model_window'));
                                                                var new_win = Ti.UI.createWindow({
                                                                        url:self.get_file_path('url', 'filter/job_filter.js'),
                                                                        pull_down_refresh:true,
                                                                        filter_class:_filter_class,
                                                                        filter_code:win.filter_code,
                                                                        query_field:_query_field,
                                                                        query_value:_query_value,
                                                                        type:_type,
                                                                        code:-1
                                                                });
                                                                Ti.UI.currentTab.open(new_win,{
                                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                });                                                                    
                                                                return;
                                                        }
                                                        break;
                                                default:
                                                        new_win = Ti.UI.createWindow({
                                                                url:self.get_file_path('url', 'filter/job_filter.js'),
                                                                pull_down_refresh:true,
                                                                filter_class:_filter_class,
                                                                filter_code:win.filter_code,
                                                                query_field:_query_field,
                                                                query_value:_query_value,
                                                                type:_type,
                                                                code:-1,
                                                                total_search_result:0
                                                        });
                                                        Ti.UI.currentTab.open(new_win,{
                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                        });                                                        
                                        }                                                                                                                                                              
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return; 
                        }
                };        

                //private member
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');                
                var _filter_class = win.filter_class;
                var _query_field = win.query_field;
                var _query_value = win.query_value;
                var _type = win.type;
                //private method
                function _init_query_value_text_field(){
                        try{
                                var row = Ti.UI.createTableViewRow({
                                        className:'data_row',
                                        header:win.title_value
                                });
                                self.query_field = Ti.UI.createTextField({
                                        height:20,
                                        paddingLeft:10,
                                        width:(self.is_ipad()?self.screen_width-80:self.screen_width-20),
                                        value:'',
                                        hintText:'Please enter value',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        keyboardType: (win.win_keyboard_type === undefined)?Titanium.UI.KEYBOARD_DEFAULT:win.win_keyboard_type,
                                        returnKeyType: Titanium.UI.RETURNKEY_DONE,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                row.add(self.query_field);
                                self.data.push(row);
                                self.query_field.addEventListener('change',function(e){
                                        _query_value = e.value;
                                });
                                self.query_field.addEventListener('return',function(e){
                                        self.nav_right_btn_click_event(e);
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_query_value_text_field');
                                return; 
                        }
                }
                function _init_query_value_text_field_for_ios7(){
                        try{
                                self.query_field = Ti.UI.createTextField({
                                        borderWidth: 1, 
                                        borderColor: '#ccc', 
                                        borderRadius: 5,
                                        top:20,
                                        height:40,
                                        paddingLeft:10,
                                        width:(self.is_ipad()?self.screen_width-80:self.screen_width-20),
                                        value:'',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        keyboardType: (win.win_keyboard_type === undefined)?Titanium.UI.KEYBOARD_DEFAULT:win.win_keyboard_type,
                                        returnKeyType: Titanium.UI.RETURNKEY_DONE,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                win.add(self.query_field);
                                self.query_field.addEventListener('change',function(e){
                                        _query_value = e.value;
                                });
                                self.query_field.addEventListener('return',function(e){
                                        self.nav_right_btn_click_event(e);
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_query_value_text_field_for_ios7');
                                return; 
                        }
                }                
        }

        win.addEventListener('open',function(){
                try{
                        if(filter_job_filter_model_window_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                filter_job_filter_model_window_page.prototype = new F();
                                filter_job_filter_model_window_page.prototype.constructor = filter_job_filter_model_window_page;
                                filter_job_filter_model_window_page_obj = new filter_job_filter_model_window_page();
                                filter_job_filter_model_window_page_obj.init();
                                filter_job_filter_model_window_page_obj.query_field.focus();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        filter_job_filter_model_window_page_obj.close_window();
                        filter_job_filter_model_window_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());








