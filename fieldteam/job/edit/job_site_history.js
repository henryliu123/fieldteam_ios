//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;  
        var job_edit_job_site_history_page_obj = null;

        function job_edit_job_site_history_page(){
                var self = this;
                var window_source = 'job_edit_job_site_history_page';
                win.title = 'Site History';
                     

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                      
                self.init  = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                if(!_is_display_no_result){
                                        self.pull_down_to_update = true;
                                        self.pull_down_to_download_more = true;                                          
                                }
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('','Main,Back');                    
                                self.init_vars();
                                if(_total_search_result > 0 && _type=='job'){
                                        _total_search_result--;
                                }
                                //call init_table_view function of parent class: fieldteam.js                                
                                self.init_table_view('plain');
                                if(_is_display_no_result){
                                        //call init_no_result_label function of parent class: fieldteam.js                                
                                        self.init_no_result_label();                                        
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }  
                };
                /**
                 *  override init  function of parent class: transaction.js
                 */    
                self.init_vars = function(){
                        try{
                                var temp_var = {};
                                var db = Titanium.Database.open(self.get_db_name());
                                var status_code_rows = db.execute('SELECT * FROM my_job_status_code');
                                if(status_code_rows != null){
                                        while(status_code_rows.isValidRow()){
                                                temp_var = {
                                                        code:status_code_rows.fieldByName('code'),
                                                        colour:status_code_rows.fieldByName('colour'),
                                                        name:status_code_rows.fieldByName('name'),
                                                        description:status_code_rows.fieldByName('description')
                                                };
                                                _status_code_array.push(temp_var);
                                                status_code_rows.next();
                                        }
                                }
                                status_code_rows.close();
                                db.close();                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };                            
                /**
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                if(e.row.className === 'download_more_jobs_on_bottom'){
                                        if(Ti.Network.online){
                                                self.begin_download_more_jobs_by_scroll_down();
                                        }else{
                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                return;                                                 
                                        }                                                                                
                                }else{                                
                                        var new_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'job/edit/job_index_view.js'),
                                                type:'job',
                                                action_for_job:'edit_job',
                                                job_id:e.row.job_id,
                                                job_reference_number:e.row.job_reference_number,
                                                job_status_code:e.row.job_status_code,
                                                parent_win:win
                                        });
                                        Ti.UI.currentTab.open(new_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                          
                };                
                /**
                 * override download_more_jobs_by_scroll_down  function of parent class: transaction.js
                 */
                self.begin_download_more_jobs_by_scroll_down = function(){
                        try{     
                                if(Ti.Network.online){
                                        self.display_indicator('Loading Data ...');
                                        Ti.App.Properties.setBool('lock_table_flag',true);
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
                                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                                        return;
                                                                }                                                                
                                                                self.refresh_job_and_relative_tables(this.responseText,'job');        
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                                self.display(true);
                                                        }else{
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(true);    
                                                                var params = {
                                                                        message:'Download more '+_type+' failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload -1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                
                                                                return;
                                                        }
                                                }catch(e){         
                                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                        params = {
                                                                message:'Download more '+_type+' failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload -2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);
                                                        return;
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                self.end_download_more_jobs_by_scroll_down(true);
                                                var params = {
                                                        message:'Download more '+_type+' failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);
                                                return;                                                
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'download_more_job',
                                                'hash':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'user_id':_selected_user_id,
                                                'existed_job_id_string':_existed_job_id_string,
                                                'existed_quote_id_string':_existed_quote_id_string,
                                                'is_exist_search_text':false,
                                                'search_text':'',
                                                'is_exist_query_field':false,//query fixed field,e.g. reference_number or strta plan
                                                'job_extra_where':_server_query_value,
                                                'job_type':'job',
                                                'view_type':'all',
                                                'limit':self.count_for_job_query,
                                                'date':'',
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });   
                                }else{
                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                        self.end_download_more_jobs_by_scroll_down(true);
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return;                                         
                                }
                        }catch(err){
                                self.end_download_more_jobs_by_scroll_down(true);
                                self.process_simple_error_message(err,window_source+' - self.begin_download_more_jobs_by_scroll_down');
                                return; 
                        }                        
                };                                
                
                /*
                *  merage the features: download_latest_log and begin_download_more_jobs_by_scroll_down
                *  avoid insert database constaint error;
                */
                self.download_latest_log_and_download_more_jobs = function(){
                        try{        
                                if(Ti.Network.online){
                                        self.display_indicator('Loading Data ...');
                                        //if os is downloading latest log then return
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var library_last_updated = 0;
                                        var rows = db.execute('SELECT * FROM my_frontend_config_setting where name=?','library_last_updated');
                                        if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                                library_last_updated = parseInt(rows.fieldByName('value'),10);
                                                var library_last_updated2 = parseInt(Titanium.App.Properties.getString('library_last_updated'),10);
                                                if(library_last_updated2 != library_last_updated){
                                                        library_last_updated =  library_last_updated2;                                          
                                                }                                
                                        }
                                        rows.close();
                                        db.close();

                                        var selected_company_id = Ti.App.Properties.getString('current_company_id');
                                        var selected_login_user_id = Ti.App.Properties.getString('current_login_user_id');
                                        

                                        Ti.App.Properties.setBool('lock_table_flag',true);
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
                                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                                        return;
                                                                }                      
                                                                self.refresh_job_and_relative_tables(this.responseText,'top'); 
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(true);                                                              
                                                                self.display(true);                                              
                                                        }else{
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(true); 
                                                                var params = {
                                                                        message:'Download latest log and more '+_type+' failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.download_latest_log_and_download_more_jobs - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                
                                                        }
                                                }catch(e){
                                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                                        self.end_download_more_jobs_by_scroll_down(true);    
                                                        params = {
                                                                message:'Download latest log and more '+_type+' failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.download_latest_log_and_download_more_jobs - xhr.onload - 2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);
                                                        return;
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                self.end_download_more_jobs_by_scroll_down(true);                                
                                                var params = {
                                                        message:'Download latest log and more '+_type+' failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.download_latest_log_and_download_more_jobs - xhr.onerror',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);
                                                return;
                                        };
                                        xhr.setTimeout(self.default_time_out);
                                        xhr.open('POST',self.get_host_url()+'update',false);
                                        xhr.send({
                                                'type':'download_latest_log_and_download_more_jobs',
                                                'library_last_updated':library_last_updated,
                                                'company_id':selected_company_id,
                                                'user_id':selected_login_user_id,
                                                'hash':selected_login_user_id,
                                                'existed_job_id_string':_existed_job_id_string,
                                                'existed_quote_id_string':_existed_quote_id_string,
                                                'is_exist_search_text':false,
                                                'search_text':'',
                                                'is_exist_query_field':false,//query fixed field,e.g. reference_number or strta plan
                                                'job_extra_where':_server_query_value,
                                                'job_type':'job',
                                                'view_type':'all',
                                                'date':'',                                                
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });
                                }
                        }catch(err){
                                Ti.App.Properties.setBool('lock_table_flag',false);
                                self.end_download_more_jobs_by_scroll_down(true);       
                                self.process_simple_error_message(err,window_source+' - self.download_latest_log_and_download_more_jobs');
                                return '';
                        } 
                };                
                /**
                 *  display site history list
                 */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                _get_job_list_with_assigned_from_is_null();
                                _get_job_list_with_assigned_from_is_not_null();                                

                                if(_is_display_no_result){
                                        if(self.no_result_label != null){
                                                self.no_result_label.visible = true;
                                        }
                                }else{
                                        if(_is_online){
                                                _existed_job_id_string = self.get_existed_job_or_quote_id_string('job',_selected_company_id);
                                                _existed_quote_id_string = '';
                                                _add_download_more_jobs_row_on_bottom();
                                        }
                                }                               
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });                                     
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                                           
                };

                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _query_records_num = 0;
                var _status_code_array = [];
                var _existed_job_id_string = '';//save existed job id string
                var _existed_quote_id_string = '';                
                var _total_search_result = ((win.total_search_result == undefined) || (win.total_search_result == null))?0:win.total_search_result;
                var _is_display_no_result = ((win.is_display_no_result == undefined) || (win.is_display_no_result == null))?false:win.is_display_no_result;
                var _is_online = ((win.is_online == undefined) || (win.is_online == null))?false:win.is_online;
                var _server_query_value = ((win.server_query_value == undefined) || (win.server_query_value == null))?'':win.server_query_value;
                                     
                /**
                 *  get job list or quote list which's assigen_from is null
                 */
                function _get_job_list_with_assigned_from_is_null(){
                        try{
                                var extra_where_condition=_setup_query_address_string(); 
                                if(extra_where_condition === 'false'){
                                        return;
                                }
                                var sql = '';
                                var sql_params = null;
                                sql_params ={
                                        is_task:false,
                                        is_calendar:false,//in calendar or in filter
                                        is_scheduled:false,//query assigned_from is not null
                                        is_check_changed:false,//check changed field or not
                                        is_check_self_job:false,//only check current user's job                                             
                                        order_by:'my_job.reference_number desc',
                                        extra_where_condition:extra_where_condition,
                                        type:'job',
                                        user_id:_selected_user_id,
                                        company_id:_selected_company_id
                                };
                                sql = self.setup_sql_query_for_display_job_list(sql_params);
                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var b = _query_records_num;
                                        _query_records_num += rows.getRowCount();   
                                        if((rows != null) && (rows.getRowCount() > 0)){
                                                while(rows.isValidRow()){
                                                        if((rows.fieldByName('assigned_from') === null)||(rows.fieldByName('assigned_from') === '')){
                                                                var status_colour = '';
                                                                var status_name = '';
                                                                var status_description = '';
                                                                for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                        if(_status_code_array[i].code == rows.fieldByName('job_status_code')){
                                                                                status_colour = _status_code_array[i].colour;
                                                                                status_name  = _status_code_array[i].name;
                                                                                status_description = _status_code_array[i].description;
                                                                                break;
                                                                        }
                                                                }                                                                                                                                  
                                                                var params = {
                                                                        is_header:(b === 0)?true:false,
                                                                        header_text:'Not Scheduled',
                                                                        job_type:'job',
                                                                        job_title:rows.fieldByName('title'),
                                                                        job_id:rows.fieldByName('id'),
                                                                        job_reference_number:rows.fieldByName('reference_number'),
                                                                        job_status_code:rows.fieldByName('job_status_code'),
                                                                        class_name:'show_job_row_'+b,
                                                                        assigned_from_hours:'',
                                                                        assigned_from_minutes:'',
                                                                        assigned_to_hours:'',
                                                                        assigned_to_minutes:'',
                                                                        job_status_color:status_colour,
                                                                        job_status_name:status_name,
                                                                        job_status_description:status_description,
                                                                        sub_number:rows.fieldByName('sub_number'),
                                                                        unit_number:rows.fieldByName('unit_number'),
                                                                        street_number:rows.fieldByName('street_number'),
                                                                        street:rows.fieldByName('street'),
                                                                        street_type:rows.fieldByName('street_type'),
                                                                        suburb:rows.fieldByName('suburb'),
                                                                        postcode:rows.fieldByName('postcode')
                                                                };                                                         
                                                                self.data.push(self.setup_job_row_for_job_list(params));
                                                                b++;
                                                        }
                                                        rows.next();
                                                }
                                        }
                                        if(rows != null){
                                                rows.close();
                                        }
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_job_list_with_assigned_from_is_null');
                                return;
                        }
                }
                /**
                *  get job list or quote list with assigned from is not null
                */
                function _get_job_list_with_assigned_from_is_not_null(){
                        try{
                                var extra_where_condition=_setup_query_address_string();   
                                if(extra_where_condition === 'false'){
                                        return;
                                }                                
                                var sql = '';                               
                                var sql_params ={
                                        is_task:false,
                                        is_calendar:false,//in calendar or in filter
                                        is_scheduled:true,//query assigned_from is not null
                                        is_check_changed:false,//check changed field or not
                                        is_check_self_job:false,//only check current user's job
                                        order_by:'assigned_from desc',
                                        extra_left_join_condition:'',
                                        extra_where_condition:extra_where_condition,
                                        type:'job',
                                        user_id:_selected_user_id,
                                        company_id:_selected_company_id
                                };
                                sql = self.setup_sql_query_for_display_job_list(sql_params);

                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var q_row_count = rows.getRowCount();
                                        var b = _query_records_num;
                                        _query_records_num += rows.getRowCount();


                                        //display the job row
                                        var temp_year = 0;
                                        var temp_month = 0;
                                        var temp_date = 0;
                                        var temp_day = 0;
                                        var temp_hours = 0;
                                        var temp_minutes = 0;
                                        var temp_string = temp_year+'-'+(temp_month+1)+'-'+temp_date;
                                        var temp_big_array = [];//save all job with schedlued from
                                        var temp_sub_array = [];//every day's jobs as a sub array
                                        var temp_sub_header_array = [];
                                        var q=0;
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        if((rows.fieldByName('assigned_from') != null)&&(rows.fieldByName('assigned_from') != '')){
                                                                var assigned_user_count = 0;
                                                                if(_query_records_num > 0){
                                                                        var assigned_user_rows = db.execute('SELECT count(*) as count FROM my_job_assigned_user WHERE status_code=1 and job_id=?',rows.fieldByName('id'));
                                                                        assigned_user_count = assigned_user_rows.fieldByName('count');
                                                                        assigned_user_rows.close();
                                                                }
                                                                var temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from'));
                                                                temp_date_value = new Date(temp_date_value*1000);
                                                                temp_year = temp_date_value.getFullYear();
                                                                temp_month = temp_date_value.getMonth()+1;
                                                                temp_date = temp_date_value.getDate();
                                                                temp_day = temp_date_value.getDay();
                                                                temp_hours = temp_date_value.getHours();
                                                                temp_minutes = temp_date_value.getMinutes();
                                                                var status_colour = '';
                                                                var status_name = '';
                                                                var status_description = '';
                                                                for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                        if(_status_code_array[i].code == rows.fieldByName('job_status_code')){
                                                                                status_colour = _status_code_array[i].colour;
                                                                                status_name  = _status_code_array[i].name;
                                                                                status_description = _status_code_array[i].description;
                                                                                break;
                                                                        }
                                                                }                                                                    
                                                                if((temp_year+'-'+temp_month+'-'+temp_date) === temp_string){
                                                                }else{
                                                                        temp_string = temp_year+'-'+temp_month+'-'+temp_date;
                                                                        temp_sub_header_array.push(self.day_list[temp_day]+' '+temp_date+'-'+self.month_list[temp_month-1]+'-'+temp_year);

                                                                        if(temp_sub_array.length > 0){
                                                                                temp_sub_array.reverse();
                                                                                temp_big_array.push(temp_sub_array);
                                                                        }
                                                                        temp_sub_array = [];//every day's jobs as a sub array
                                                                }

                                                                var assigned_to_hours = '';
                                                                var assigned_to_minutes = '';
                                                                if((rows.fieldByName('assigned_to') != undefined) && (rows.fieldByName('assigned_to') != null) && (rows.fieldByName('assigned_to') != '')){
                                                                        var assigned_to_temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to'));
                                                                        assigned_to_temp_date_value = new Date(assigned_to_temp_date_value*1000);
                                                                        assigned_to_hours = assigned_to_temp_date_value.getHours();
                                                                        assigned_to_minutes = assigned_to_temp_date_value.getMinutes();
                                                                }

                                                                var params = {
                                                                        is_header:false,
                                                                        header_text:'',
                                                                        job_type:'job',
                                                                        job_title:rows.fieldByName('title'),
                                                                        job_id:rows.fieldByName('id'),
                                                                        job_reference_number:rows.fieldByName('reference_number'),
                                                                        job_status_code:rows.fieldByName('job_status_code'),
                                                                        class_name:'show_job_row_'+b,
                                                                        assigned_from_hours:temp_hours,
                                                                        assigned_from_minutes:temp_minutes,
                                                                        assigned_to_hours:assigned_to_hours,
                                                                        assigned_to_minutes:assigned_to_minutes,
                                                                        job_status_color:status_colour,
                                                                        job_status_name:status_name,
                                                                        job_status_description:status_description,
                                                                        sub_number:rows.fieldByName('sub_number'),
                                                                        unit_number:rows.fieldByName('unit_number'),
                                                                        street_number:rows.fieldByName('street_number'),
                                                                        street:rows.fieldByName('street'),
                                                                        street_type:rows.fieldByName('street_type'),
                                                                        suburb:rows.fieldByName('suburb'),
                                                                        postcode:rows.fieldByName('postcode'),
                                                                        assigned_user_count:assigned_user_count
                                                                };      
                                                                temp_sub_array.push(self.setup_job_row_for_job_list(params));
                                                                b++;
                                                        }
                                                        if(q+1 === q_row_count){
                                                                temp_sub_array.reverse();
                                                                temp_big_array.push(temp_sub_array);
                                                        }
                                                        q++;
                                                        rows.next();
                                                }
                                        }
                                        rows.close();
                                        db.close();
                                        //load data into array by new order
                                        for(i=0,j=temp_big_array.length;i<j;i++){
                                                for(var m=0,n=temp_big_array[i].length;m<n;m++){
                                                        if(m === 0){
                                                                temp_big_array[i][m].header = temp_sub_header_array[i];
                                                        }
                                                        self.data.push(temp_big_array[i][m]);
                                                }
                                        }
                                        for(i=0,j=self.data.length;i<j;i++){
                                                if(i%2 === 0){
                                                        self.data[i].backgroundColor = self.job_list_row_background_color;
                                                }else{
                                                        self.data[i].backgroundColor = '#fff';
                                                }
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_job_list_with_assigned_from_is_not_null');
                                return;
                        }
                }                      
                
                /**
                 *  setup query address string
                 */
                function _setup_query_address_string(){
                        try{
                                var street_type_id = 0;
                                var state_id = 0;
                                var street_number = '';
                                var street = '';
                                var suburb = '';
                                var postcode = '';
                                var db = Titanium.Database.open(self.get_db_name());

                                var selected_job_obj = db.execute('SELECT * FROM my_'+_type+' WHERE id=? and company_id=?',_selected_job_id,_selected_company_id);
                                if((selected_job_obj.getRowCount() > 0) &&(selected_job_obj.isValidRow())){
                                        street_type_id = selected_job_obj.fieldByName('locality_street_type_id');
                                        state_id = selected_job_obj.fieldByName('locality_state_id');
                                        street_number = self.trim(selected_job_obj.fieldByName('street_number'));
                                        street = self.trim(selected_job_obj.fieldByName('street'));
                                        suburb = self.trim(selected_job_obj.fieldByName('suburb'));
                                        postcode = self.trim(selected_job_obj.fieldByName('postcode'));
                                }
                                selected_job_obj.close();
                                db.close();
                                
                                if((self.trim(street_number) == '') && (self.trim(street) == '') && (self.trim(suburb) == '') && (self.trim(postcode) == '')){
                                        return 'false';
                                }

                                var extra_where_condition = '';                                                                                                                                                                
                                if((street != undefined) && (street != null) && (street != '')){
                                        var streetTypeName = '';
                                        var streetTypeId = 0;
                                        var newStreet = '';
                                        if(self.trim(street) != ''){
                                                var streetArray = self.trim(street).split(' ');
                                                if(streetArray.length > 1){
                                                        streetTypeName = streetArray[streetArray.length-1];
                                                        streetTypeId = self.return_street_type_id(streetTypeName);
                                                }
                                                if(streetTypeId > 0){
                                                        for(var i=0,j=streetArray.length-1;i<j;i++){
                                                                if(i>0){
                                                                        newStreet+=' ';
                                                                }
                                                                newStreet += streetArray[i];
                                                        }
                                                }else{
                                                        streetTypeId = (street_type_id == null)?0:street_type_id;
                                                }
                                        }               

                                        if(newStreet != ''){
                                                newStreet = self.replace(newStreet,'"',''); //remove " symbol
                                                extra_where_condition += '(upper(my_job.street)  = upper(\"'+newStreet+'\") or (upper(my_job.street)  = upper(\"'+newStreet+' '+streetTypeName+'\")))';
                                        }else{
                                                if(street != ''){
                                                        street = self.replace(street,'"',''); //remove " symbol
                                                }
                                                extra_where_condition += '(upper(my_job.street)  = upper(\"'+street+'\") or (upper(my_job.street)  = upper(\"'+street+' '+streetTypeName+'\")))';
                                        }
                                        if(streetTypeId > 0){
                                                extra_where_condition += ' and my_job.locality_street_type_id='+streetTypeId;
                                        }
                                        if((street_number != undefined) && (street_number != null) && (street_number != '')){
                                                street_number = self.replace(street_number,'"',''); //remove " symbol
                                                extra_where_condition += ' and upper(my_job.street_number) = upper(\"'+street_number+'\")';
                                        }
                                        if((suburb != undefined) && (suburb != null) && (suburb != '')){
                                                suburb = self.replace(suburb,'"',''); //remove " symbol
                                                extra_where_condition += ' and upper(my_job.suburb) =upper(\"'+suburb+'\")';
                                        }    
                                        if((postcode != undefined) && (postcode != null) && (postcode != '')){
                                                postcode = self.replace(postcode,'"',''); //remove " symbol
                                                extra_where_condition += ' and upper(my_job.postcode) =upper(\"'+postcode+'\")';
                                        }                                            
                                        if((state_id != undefined) && (state_id != null) && (state_id != '')){
                                                extra_where_condition += ' and my_job.locality_state_id = '+state_id;
                                        }else{
                                                extra_where_condition += ' and my_job.locality_state_id = 0';
                                        }                                        
                                        if(_type === 'job'){
                                                extra_where_condition+= ' and my_job.id not in ('+_selected_job_id+')';
                                        }else{
                                        }    
                                        return extra_where_condition;
                                }else{
                                        return 'false';
                                }                                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_query_address_string');
                                return 'false';
                        }
                }
                                
                /**
                 * display "download more jobs" row
                 */
                function _add_download_more_jobs_row_on_bottom(){
                        try{                                
                                var row = Ti.UI.createTableViewRow({
                                        height:'auto',
                                        className:'download_more_jobs_on_bottom'
                                });                
                
                                var download_more_results = Ti.UI.createLabel({
                                        text:"Download More Results ...",
                                        width:300,
                                        top:5,
                                        bottom:25,
                                        height:20,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:15,
                                                fontWeight:"bold"
                                        }
                                });        
                                row.add(download_more_results);
                                                                                                          
                                var total_my_jobs_on_server = Ti.UI.createLabel({
                                        text:'',
                                        width:300,
                                        bottom:5,
                                        height:12,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12
                                        }
                                });                 
                                row.add(total_my_jobs_on_server);
                                self.data.push(row);
                                
                                total_my_jobs_on_server.text ='Total '+_total_search_result+' '+self.ucfirst('job')+((_total_search_result>1)?'s':'')+', Displaying '+(self.data.length-1)+' '+self.ucfirst('job')+(((self.data.length-1)>1)?'s':'');                                                                                            
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_download_more_jobs_row_on_bottom');
                                return;
                        }
                }                
                
        }

        win.addEventListener('focus',function(){
                try{
                        if(job_edit_job_site_history_page_obj === null){
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                job_edit_job_site_history_page.prototype = new F();
                                job_edit_job_site_history_page.prototype.constructor = job_edit_job_site_history_page;
                                job_edit_job_site_history_page_obj = new job_edit_job_site_history_page();
                                //call parent class's function : init
                                job_edit_job_site_history_page_obj.init();
                        }
                        job_edit_job_site_history_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_site_history_page_obj.close_window();
                        job_edit_job_site_history_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                        
        });
}());


