/**
 *  Description: date and time picker
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;       
        var job_filter_date_page_obj = null;
    
        function job_filter_date_page(){
                var self = this;
                var window_source = 'job_filter_date_page';
                win.title = 'Filter By Date Created';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                     
                self.init = function(){
                        try{                   
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');         
                                self.display_indicator('Loading Data ...',false);
                                self.init_vars();                               
                                self.init_table_view();
                                _show_date_from_picker();
                                setTimeout(function(){
                                        self.hide_indicator();
                                },1000);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_table_view function of parent class: fieldteam.js
                 */                     
                self.init_table_view = function(){
                        try{
                                self.table_view = Ti.UI.createTableView({
                                        data:self.data,
                                        scrollable:false,
                                        style: Ti.UI.iPhone.TableViewStyle.GROUPED,
                                        allowsSelection:true
                                });
                                win.add(self.table_view);
                                self.table_view.selectRow(0);

                                self.table_view.addEventListener('click',function(e){
                                        self.table_view_click_event(e);
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_table_view');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                  
                self.init_vars = function(){
                        try{
                                self.date_from_row = Ti.UI.createTableViewRow({
                                        title:'Date From : '+self.day_list[_calendar_date_from_day]+', '+_calendar_date_from_date+' '+self.month_list[_calendar_date_from_month]+' '+_calendar_date_from_year,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size
                                        }
                                });
                                self.data.push(self.date_from_row);

                                self.date_to_row = Ti.UI.createTableViewRow({
                                        title:'Date To : '+self.day_list[_calendar_date_to_day]+', '+_calendar_date_to_date+' '+self.month_list[_calendar_date_to_month]+' '+_calendar_date_to_year,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size
                                        }
                                });
                                self.data.push(self.date_to_row);                              
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };
                /**
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                       
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                switch(index){
                                        case 0:
                                                _show_date_from_picker();
                                                break;
                                        case 1:
                                                _show_date_to_picker();
                                                break;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(){
                        try{
                                var error_string = '';
                                var temp_from_month = ((_calendar_date_from_month+1) <=9)?'0'+(_calendar_date_from_month+1):(_calendar_date_from_month+1);
                                var temp_from_date = (_calendar_date_from_date <=9)?'0'+_calendar_date_from_date:_calendar_date_from_date;
                                var temp_to_month = ((_calendar_date_to_month+1) <=9)?'0'+(_calendar_date_to_month+1):(_calendar_date_to_month+1);
                                var temp_to_date = (_calendar_date_to_date <=9)?'0'+_calendar_date_to_date:_calendar_date_to_date;                                
                                var date_from_string = _calendar_date_from_year+'-'+temp_from_month+'-'+temp_from_date;
                                var date_to_string = _calendar_date_to_year+'-'+temp_to_month+'-'+temp_to_date;
                                if(self.get_seconds_value_by_time_string(date_from_string+' 00:00:00') > self.get_seconds_value_by_time_string(date_to_string+' 23:59:59')){
                                        error_string = 'Date To can\'t less than Date From.\n';
                                }
                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return; 
                                }
                                var filter_class = win.filter_class;
                                var filter_code = win.filter_code;        
                                var filter_title = win.title_value;  
                                var query_value = 'UNIX_TIMESTAMP(my_'+win.type+'.'+'created) >= UNIX_TIMESTAMP(\''+date_from_string+' 00:00:00\')  and UNIX_TIMESTAMP(my_'+win.type+'.'+'created) <= UNIX_TIMESTAMP(\''+date_to_string+' 23:59:59\')';
                                var query_value2 = '(my_'+win.type+'.'+'created) >= (\''+date_from_string+' 00:00:00\')  and (my_'+win.type+'.'+'created) <= (\''+date_to_string+' 23:59:59\')';                                        
                                if(Ti.Network.online){
                                        self.display_indicator('Loading Data ...');
                                        var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                                        var _selected_company_id = Ti.App.Properties.getString('current_company_id');  
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
                                                                var new_model_win = Ti.UI.createWindow({
                                                                        url:self.get_file_path('url','filter/job_filter.js'),
                                                                        pull_down_refresh:true,
                                                                        filter_class:filter_class,
                                                                        query_value:query_value2,
                                                                        query_field:'',
                                                                        filter_code:filter_code,
                                                                        title_value:filter_title,
                                                                        type:win.type,
                                                                        total_search_result:total_search_result
                                                                });
                                                                Ti.UI.currentTab.open(new_model_win,{
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
                                                                        error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload -1',
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
                                                                error_source:window_source+' - self.nav_right_btn_click_event - xhr.onload -2',
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
                                                'filter_class':filter_class,
                                                'filter_code':filter_code,
                                                'query_field':'',
                                                'query_value':query_value,
                                                'search_query_value':query_value,
                                                'job_type':win.type,
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });     
                                }else{
                                        self.show_message(L('message_offline_in_job_filter_model_window'));
                                        new_model_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'filter/job_filter.js'),
                                                source_name:win.source_name,
                                                pull_down_refresh:true,
                                                filter_class:win.filter_class,
                                                filter_code:win.filter_code,
                                                query_value:query_value2,
                                                query_field:'',
                                                title_value:filter_title,
                                                type:win.type,
                                                code:-1
                                        });
                                        Ti.UI.currentTab.open(new_model_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });                                        
                                        return;
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };          

                //private member       
                var  _calendar_date = new Date();

                var _calendar_date_from_year = _calendar_date.getFullYear();
                var _calendar_date_from_month = _calendar_date.getMonth();
                var _calendar_date_from_date = _calendar_date.getDate();
                var _calendar_date_from_day = _calendar_date.getDay();

                var _calendar_date_to_year = _calendar_date.getFullYear();
                var _calendar_date_to_month = _calendar_date.getMonth();
                var _calendar_date_to_date = _calendar_date.getDate();
                var _calendar_date_to_day = _calendar_date.getDay();
                
                var _date_from_picker = null;
                var _date_to_picker = null;
                /**
                 * display date from picker
                 */
                function _show_date_from_picker(){
                        try{
                                if(_date_from_picker != null){
                                        win.remove(_date_from_picker);
                                        _date_from_picker = null;
                                }
                                var minDate = new Date();
                                minDate.setFullYear(_calendar_date_from_year-5);
                                minDate.setMonth(0);
                                minDate.setDate(1);

                                var maxDate = new Date();
                                maxDate.setFullYear(_calendar_date_from_year+5);
                                maxDate.setMonth(11);
                                maxDate.setDate(31);

                                var value = new Date();
                                value.setFullYear(_calendar_date_from_year);
                                value.setMonth(_calendar_date_from_month);
                                value.setDate(_calendar_date_from_date);

                                _date_from_picker = Ti.UI.createPicker({
                                        bottom:0,
                                        type:Ti.UI.PICKER_TYPE_DATE,
                                        minDate:minDate,
                                        maxDate:maxDate,
                                        value:value
                                });
                                _date_from_picker.selectionIndicator = true;
                                _date_from_picker.setLocale(Titanium.Platform.locale);
                                win.add(_date_from_picker);
                                                                
                                _date_from_picker.addEventListener('change',function(e){
                                        self.table_view.selectRow(0);
                                        var newDateValue = new Date(e.value);
                                        _calendar_date_from_year = newDateValue.getFullYear();
                                        _calendar_date_from_month = newDateValue.getMonth();
                                        _calendar_date_from_date = newDateValue.getDate();
                                        _calendar_date_from_day = newDateValue.getDay();
                                        self.date_from_row.title = 'Date From : '+self.day_list[_calendar_date_from_day]+', '+_calendar_date_from_date+' '+self.month_list[_calendar_date_from_month]+' '+_calendar_date_from_year;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _show_date_from_picker');
                                return;
                        }
                }
                
                /**
                 * display date to picker
                 */
                function _show_date_to_picker(){
                        try{
                                if(_date_to_picker != null){
                                        win.remove(_date_to_picker);
                                        _date_to_picker = null;
                                }
                                var minDate = new Date();
                                minDate.setFullYear(_calendar_date_to_year-5);
                                minDate.setMonth(0);
                                minDate.setDate(1);

                                var maxDate = new Date();
                                maxDate.setFullYear(_calendar_date_to_year+5);
                                maxDate.setMonth(11);
                                maxDate.setDate(31);

                                var value = new Date();
                                value.setFullYear(_calendar_date_to_year);
                                value.setMonth(_calendar_date_to_month);
                                value.setDate(_calendar_date_to_date);

                                _date_to_picker = Ti.UI.createPicker({
                                        bottom:0,
                                        type:Ti.UI.PICKER_TYPE_DATE,
                                        minDate:minDate,
                                        maxDate:maxDate,
                                        value:value
                                });
                                _date_to_picker.selectionIndicator = true;
                                _date_to_picker.setLocale(Titanium.Platform.locale);
                                win.add(_date_to_picker);
                                                                
                                _date_to_picker.addEventListener('change',function(e){
                                        self.table_view.selectRow(0);
                                        var newDateValue = new Date(e.value);
                                        _calendar_date_to_year = newDateValue.getFullYear();
                                        _calendar_date_to_month = newDateValue.getMonth();
                                        _calendar_date_to_date = newDateValue.getDate();
                                        _calendar_date_to_day = newDateValue.getDay();
                                        self.date_to_row.title = 'Date To : '+self.day_list[_calendar_date_to_day]+', '+_calendar_date_to_date+' '+self.month_list[_calendar_date_to_month]+' '+_calendar_date_to_year;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _show_date_to_picker');
                                return;
                        }
                }                
        }

        win.addEventListener('open',function(){
                try{
                        if(job_filter_date_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_filter_date_page.prototype = new F();
                                job_filter_date_page.prototype.constructor = job_filter_date_page;
                                job_filter_date_page_obj = new job_filter_date_page();
                                job_filter_date_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_filter_date_page_obj.close_window();
                        job_filter_date_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());









