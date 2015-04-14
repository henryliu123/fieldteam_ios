/**
 *  Description: job filter, user can query any job
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;
        var filter_job_filter_page_obj = null;
        function filter_job_filter_page(){
                var self = this;
                var window_source = 'filter_job_filter_page';
                win.title = self.ucfirst(win.type)+' List';
                               
                self.download_type = win.type;
                self.pull_down_to_update = true;
                self.pull_down_to_download_more = true;                
                //public method
                /**
                 *  override init  function of parent class: transaction.js
                 */                    
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Add','Main,Back');
                                //self.init_controls();
                                self.init_vars();
                                //call init_table_view function of parent class: transaction.js
                                self.init_table_view('plain');  
                                //call init_no_result_label function of parent class: fieldteam.js
                                Ti.App.addEventListener('refresh_job_filter_list',function(){
                                        if((win != undefined)&&(win!=null)){
                                                self.display();
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 * init some controls
                 */
                self.init_controls = function(){
                        try{
                                var help_label = Ti.UI.createLabel({
                                        text:'Drag Screen For More Results From The Server ',
                                        bottom:3,
                                        height:14,
                                        font:{
                                                fontSize:12
                                        },
                                        color:'#fff',
                                        textAlign:'center',
                                        width:300                   
                                });

                                var bottom_tool_bar = Titanium.UI.createView({
                                        borderWidth:0,
                                        bottom:0,
                                        width:self.screen_width,
                                        height:20,
                                        backgroundColor:self.default_tool_bar_background_color,   
                                        zIndex:100
                                });
                                bottom_tool_bar.add(help_label);
                                win.add(bottom_tool_bar);                                    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_controls');
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
                                var status_code_rows = db.execute('SELECT * FROM my_'+_type+'_status_code');
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
                 * create pull down view
                 */
                self.init_pull_down_view = function(){
                        var self = this;
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_'+_type+'_status_code WHERE code=?',_filter_code);
                                if(rows.isValidRow()){
                                        _filter_code_name = rows.fieldByName('name');
                                }
                                rows.close();
                                db.close();                                
                                self.pulling = false;
                                self.downloading = false;
                                var pull_view_border = Ti.UI.createView({
                                        backgroundColor:"#576c89",
                                        height:2,
                                        bottom:0
                                });
                                var table_view_header = Ti.UI.createView({
                                        backgroundColor:self.tool_bar_background_color,
                                        width:320,
                                        height:60
                                });
                                // fake it til ya make it..  create a 2 pixel
                                // bottom border
                                table_view_header.add(pull_view_border);
                                var pull_view_arrow = Ti.UI.createView({
                                        backgroundImage:self.get_file_path('image','whiteArrow.png'),
                                        width:23,
                                        height:60,
                                        bottom:10,
                                        left:20
                                });
                                var pull_view_status_label = Ti.UI.createLabel({
                                        text:"Pull down to download ...",
                                        width:self.screen_width,
                                        left:30,
                                        bottom:45,
                                        height:20,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12,
                                                fontWeight:"bold"
                                        }
                                });   
                                
                                self.total_my_jobs_on_server = Ti.UI.createLabel({
                                        text:'Total '+_job_or_quote_number_on_server+' '+self.ucfirst(_type)+((_job_or_quote_number_on_server>1)?'s':'')+', Displaying '+_downloade_job_or_quote_number+' '+self.ucfirst(_type)+((_downloade_job_or_quote_number>1)?'s':''),
                                        width:self.screen_width,
                                        left:30,
                                        bottom:25,
                                        height:20,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12
                                        }
                                });                                                                                 
                                
                                var pull_view_last_updated = Ti.UI.createLabel({
                                        text:'Last Updated : '+self.get_last_updated_time_text(),
                                        left:30,
                                        width:self.screen_width,
                                        bottom:10,
                                        height:12,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12
                                        }
                                });                
                                table_view_header.add(pull_view_arrow);
                                table_view_header.add(pull_view_status_label);
                                table_view_header.add(self.total_my_jobs_on_server);
                                table_view_header.add(pull_view_last_updated);
                                return table_view_header;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_pull_down_view');
                                return null;
                        }
                };                
                /**
                 *  override nav_right_btn_click_event  function of parent class: transaction.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                var add_job_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/edit/job_index_view.js'),
                                        type:win.type,
                                        job_id:0,
                                        job_reference_number:0,
                                        job_status_code:0,
                                        action_for_job:'add_job'
                                });
                                Ti.UI.currentTab.open(add_job_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };                    
                /**
                 *  override table_view_click_event  function of parent class: transaction.js
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
                                                url:self.get_file_path('url','job/edit/job_index_view.js'),
                                                type:_type,
                                                action_for_job:'edit_job',
                                                job_id:self.data[e.index].job_id,
                                                job_reference_number:self.data[e.index].job_reference_number,
                                                job_status_code:self.data[e.index].job_status_code
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
                                        var job_extra_where = '';
                                        if(_filter_code === -1){
                                                switch(_filter_class){
                                                        case 'find_job_number':
                                                        case 'find_quote_number':
                                                                job_extra_where = 'reference_number='+_query_value;
                                                                break;
                                                        case 'unassigned_jobs':
                                                        case 'unassigned_quotes':
                                                                job_extra_where = 'id not in (select distinct(a.'+_type+'_id) from '+_type+'_assigned_user as a where a.status_code=1)';
                                                                break;                                                                
                                                        case 'find_job_strata_plan_number':
                                                        case 'find_quote_strata_plan_number':
                                                                job_extra_where = 'sp like \'%'+_query_value+'%\'';
                                                                break;     
                                                        case 'find_job_order_reference_number':
                                                        case 'find_quote_order_reference_number':
                                                                job_extra_where = 'order_reference like \'%'+_query_value+'%\'';
                                                                break;    
                                                        case 'find_job_title':
                                                        case 'find_quote_title':
                                                                job_extra_where = 'title like \'%'+_query_value+'%\'';
                                                                break;                                                                    
                                                        case 'find_job_address':
                                                        case 'find_quote_address':
                                                        case 'find_job_date':
                                                        case 'find_quote_date':
                                                                job_extra_where = win.server_query_value;                                                               
                                                                break;
                                                }
                                        }else{
                                                job_extra_where = _type+'_status_code='+_filter_code;
                                        }

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
                                                        Ti.API.info(this.responseText);
                                                        if((xhr.readyState === 4)&&(this.status === 200)){
                                                                if(self.return_to_login_page_if_user_security_session_changed(this.responseText)){
                                                                        return;
                                                                }                                                                 
                                                                if(self.display_app_version_incompatiable(this.responseText)){
                                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                                        return;
                                                                }                                                                
                                                                switch(_type){
                                                                        case 'job':
                                                                        case 'quote':
                                                                                self.refresh_job_and_relative_tables(this.responseText,_type);
                                                                                break;
                                                                        case 'both'://job and quote
                                                                                self.refresh_job_and_relative_tables(this.responseText,'all');    
                                                                                break;
                                                                }
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(false);
                                                                self.display(true);
                                                        }else{
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(true);   
                                                                var params = {
                                                                        message:'Download more '+win.type+' failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload - 1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);                                                                 
                                                                return;
                                                        }
                                                }catch(e){         
                                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                        params = {
                                                                message:'Download more '+win.type+' failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down - xhr.onload - 2',
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
                                                        message:'Download more '+win.type+' failed.',
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
                                                'is_exist_search_text':(self.trim(_search_text) != '')?true:false,
                                                'search_text':self.trim(_search_text),
                                                'is_exist_query_field':false,//query fixed field,e.g. reference_number or strta plan
                                                'job_extra_where':job_extra_where,
                                                'job_type':win.type,
                                                'limit':self.count_for_job_query,
                                                'view_type':'all',
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
                                        var job_extra_where = '';
                                        if(_filter_code === -1){
                                                switch(_filter_class){
                                                        case 'find_job_number':
                                                        case 'find_quote_number':
                                                                job_extra_where = 'reference_number='+_query_value;
                                                                break;
                                                        case 'find_job_strata_plan_number':
                                                        case 'find_quote_strata_plan_number':
                                                                job_extra_where = 'sp like \'%'+_query_value+'%\'';
                                                                break;  
                                                        case 'find_job_order_reference_number':
                                                        case 'find_quote_order_reference_number':
                                                                job_extra_where = 'order_reference like \'%'+_query_value+'%\'';
                                                                break; 
                                                        case 'find_job_title':
                                                        case 'find_quote_title':
                                                                job_extra_where = 'title like \'%'+_query_value+'%\'';
                                                                break;                                                                 
                                                        case 'find_job_address':
                                                        case 'find_quote_address':
                                                        case 'find_job_date':
                                                        case 'find_quote_date':
                                                                job_extra_where = win.server_query_value;                                                               
                                                                break;

                                                }
                                        }else{
                                                job_extra_where = _type+'_status_code='+_filter_code;
                                        }

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
                                                                self.end_download_more_jobs_by_scroll_down(false);                                                              
                                                                self.display(true);                                              
                                                        }else{
                                                                Ti.App.Properties.setBool('lock_table_flag',false);
                                                                self.end_download_more_jobs_by_scroll_down(true);    
                                                                var params = {
                                                                        message:'Download more '+win.type+' failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:e,
                                                                        error_source:window_source+' - self.download_latest_log_and_download_more_jobs - xhr.onload -1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);
                                                                return;
                                                        }
                                                }catch(e){
                                                        Ti.App.Properties.setBool('lock_table_flag',false);
                                                        self.end_download_more_jobs_by_scroll_down(true);    
                                                        params = {
                                                                message:'Download more '+win.type+' failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.download_latest_log_and_download_more_jobs - xhr.onload -2',
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
                                                        message:'Download more '+win.type+' failed..',
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
                                                'is_exist_search_text':(self.trim(_search_text) != '')?true:false,
                                                'search_text':self.trim(_search_text),
                                                'is_exist_query_field':false,//query fixed field,e.g. reference_number or strta plan
                                                'job_extra_where':job_extra_where,
                                                'job_type':win.type,
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
                 *  get job extra condition when query more jobs
                 */
                self.get_extra_conditions_when_download_more_jobs = function(){
                        try{
                                if(_filter_code === -1){
                                        switch(_filter_class){
                                                case 'find_job_number':
                                                case 'find_quote_number':
                                                        self.job_extra_where = 'reference_number='+_query_value;
                                                        break;
                                                case 'find_job_strata_plan_number':
                                                case 'find_quote_strata_plan_number':
                                                        self.job_extra_where = 'sp like \'%'+_query_value+'%\'';
                                                        break;
                                                case 'find_job_order_reference_number':
                                                case 'find_quote_order_reference_number':
                                                        self.job_extra_where = 'order_reference like \'%'+_query_value+'%\'';
                                                        break;
                                                case 'find_job_title':
                                                case 'find_quote_title':
                                                        self.job_extra_where = 'title like \'%'+_query_value+'%\'';
                                                        break;                                                        
                                        }
                                }else{
                                        self.job_extra_where = _type+'_status_code='+_filter_code;
                                }             
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.get_extra_conditions_when_download_more_jobs');
                                return; 
                        }
                };                
                /**
                 *  display list
                 */                    
                self.display = function(is_update_message){
                        try{                     
                                if((is_update_message == undefined) || (is_update_message === null) || (!is_update_message)){
                                        self.display_indicator('Loading Data ...');
                                }else{
                                        self.update_message('Loading Data ...');
                                }
                                _get_my_job_or_quote_number();
                                switch(_filter_class){
                                        case 'find_job_number':          
                                        case 'find_quote_number':
                                        case 'find_job_strata_plan_number':
                                        case 'find_quote_strata_plan_number':
                                        case 'find_job_address':
                                        case 'find_quote_address':
                                        case 'find_job_date':
                                        case 'find_quote_date':
                                        case 'find_job_order_reference_number':
                                        case 'find_quote_order_reference_number':
                                        case 'find_job_title':
                                        case 'find_quote_title':
                                                self.total_my_jobs_on_server.text ='Total '+_total_search_result+' '+self.ucfirst(_type)+((_total_search_result>1)?'s':'')+', Displaying '+_downloade_job_or_quote_number+' '+self.ucfirst(_type)+((_downloade_job_or_quote_number>1)?'s':'');                                                              
                                                break;
                                        default:
                                                self.total_my_jobs_on_server.text ='Total '+_job_or_quote_number_on_server+' '+self.ucfirst(_type)+((_job_or_quote_number_on_server>1)?'s':'')+', Displaying '+_downloade_job_or_quote_number+' '+self.ucfirst(_type)+((_downloade_job_or_quote_number>1)?'s':'');
                                }                               
                                
                                //has been displayed id array
                                self.data = [];
                                self.table_view.setData([]);
                                _query_records_num = 0;
                                if((_filter_class === 'find_job_number')||(_filter_class === 'find_quote_number')){
                                        _get_job_with_inputted_reference_number();
                                }else{                                        
                                        _get_job_list_with_assigned_from_is_null();
                                        if((_filter_class == 'unassigned_jobs') || (_filter_class == 'unassigned_quotes')){                                                
                                        }else{
                                                _get_job_list_with_assigned_from_is_not_null();
                                        }
                                }
                                _existed_job_id_string = self.get_existed_job_or_quote_id_string('job',_selected_company_id);
                                _existed_quote_id_string = self.get_existed_job_or_quote_id_string('quote',_selected_company_id);
                                _add_download_more_jobs_row_on_bottom();
                                
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });
                                setTimeout(function(){
                                        self.hide_indicator();
                                },500);                                
                        }catch(err){
                                self.hide_indicator();
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return; 
                        }                        
                };
                                                            
                         
                
                
                //private member
                var _type = (win.type === undefined)?'job':win.type;
                var _filter_class = (win.filter_class === undefined)?'':win.filter_class;
                var _filter_code = (win.filter_code === undefined)?-1:win.filter_code;
                var _filter_code_name = '';
                var _query_field = ((win.query_field === null)||(win.query_field === undefined)||(win.query_field === ''))?'':win.query_field;
                var _query_value = ((win.query_value === null)||(win.query_value === undefined)||(win.query_value === ''))?'':win.query_value;
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _search_text = '';
                var _query_records_num = 0;
                var _existed_job_id_string = '';//save existed job id string
                var _existed_quote_id_string = '';
                var _status_code_array = [];
                var _job_or_quote_number_on_server = 0;               
                var _downloade_job_or_quote_number = 0;   
                var _total_search_result = ((win.total_search_result == undefined) || (win.total_search_result == null))?0:win.total_search_result;

                //private methods        
                /**
                 *  get job or quote with inputted reference number
                 */
                function _get_job_with_inputted_reference_number(){
                        //get all job or quotes by reference_number
                        try{
                                var sql = '';
                                var sql_params = null;
                                if(_filter_code === -1){
                                        switch(_filter_class){
                                                case 'find_job_number':
                                                case 'find_quote_number':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:true,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.reference_number ='+_query_value,
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;
                                        }
                                }
                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var b = _query_records_num;
                                        _query_records_num += rows.getRowCount();
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        var status_colour = '';
                                                        var status_name = '';
                                                        var status_description = '';
                                                        for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                if(_status_code_array[i].code == rows.fieldByName(_type+'_status_code')){
                                                                        status_colour = _status_code_array[i].colour;
                                                                        status_name  = _status_code_array[i].name;
                                                                        status_description = _status_code_array[i].description;
                                                                        break;
                                                                }
                                                        }                                                                                                                 
                                                        var temp_hours = '';
                                                        var temp_minutes = '';
                                                        if((rows.fieldByName('assigned_from') != null) && (rows.fieldByName('assigned_from') != '')){
                                                                var temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_from'));
                                                                temp_date_value = new Date(temp_date_value*1000);
                                                                temp_hours = temp_date_value.getHours();
                                                                temp_minutes = temp_date_value.getMinutes();
                                                        }

                                                        var assigned_to_hours = '';
                                                        var assigned_to_minutes = '';
                                                        if((rows.fieldByName('assigned_to') != null) && (rows.fieldByName('assigned_to') != '')){
                                                                var assigned_to_temp_date_value = self.get_seconds_value_by_time_string(rows.fieldByName('assigned_to'));
                                                                assigned_to_temp_date_value = new Date(assigned_to_temp_date_value*1000);
                                                                assigned_to_hours = assigned_to_temp_date_value.getHours();
                                                                assigned_to_minutes = assigned_to_temp_date_value.getMinutes();
                                                        }                                                
                                                        var params = {
                                                                is_header:false,
                                                                header_text:'',
                                                                job_type:_type,
                                                                job_title:rows.fieldByName('title'),
                                                                job_id:rows.fieldByName('id'),
                                                                job_reference_number:rows.fieldByName('reference_number'),
                                                                job_status_code:rows.fieldByName(_type+'_status_code'),
                                                                class_name:'show_'+_type+'_row_'+b,
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
                                                                postcode:rows.fieldByName('postcode') 
                                                        };                                                                                                      
                                                        self.data.push(self.setup_job_row_for_job_list(params));
                                                        b++;
                                                        rows.next();
                                                }
                                        }
                                        rows.close();
                                        db.close();
                                }
                                for(i=0,j=self.data.length;i<j;i++){
                                        if(i%2 === 0){
                                                self.data[i].backgroundColor = self.job_list_row_background_color;
                                        }else{
                                                self.data[i].backgroundColor = '#fff';
                                        }
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_job_with_inputted_reference_number');
                                return; 
                        }
                }
                /**
                 *  get job list or quote list which's assigen_from is null
                 */
                function _get_job_list_with_assigned_from_is_null(){
                        try{
                                var sql = '';
                                var sql_params = null;
                                if(_filter_code === -1){
                                        switch(_filter_class){
                                                case 'find_job_strata_plan_number':
                                                case 'find_quote_strata_plan_number':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.sp like \'%'+_query_value+'%\'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;
                                                case 'find_job_order_reference_number':
                                                case 'find_quote_order_reference_number':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.order_reference like \'%'+_query_value+'%\'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;     
                                                case 'find_job_title':
                                                case 'find_quote_title':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.title like \'%'+_query_value+'%\'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;                                                                
                                                case 'find_job_address':
                                                case 'find_quote_address':
                                                case 'find_job_date':
                                                case 'find_quote_date':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:_query_value,
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;                                                        
                                                case 'all_jobs':
                                                case 'all_quotes':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',                                                             
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;
                                                case 'unassigned_jobs':
                                                case 'unassigned_quotes':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',                                                             
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.id not in (select distinct(m.'+_type+'_id) from my_'+_type+'_assigned_user as m where m.status_code=1)',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;                                                        
                                        }
                                }else{
                                        sql_params ={
                                                is_task:false,
                                                is_calendar:false,//in calendar or in filter
                                                is_scheduled:false,//query assigned_from is not null
                                                is_check_changed:false,//check changed field or not
                                                is_check_self_job:false,//only check current user's job                                             
                                                order_by:'my_'+_type+'.reference_number desc',
                                                extra_left_join_condition:'',
                                                extra_where_condition:_type+'_status_code='+_filter_code,
                                                type:_type,
                                                user_id:_selected_user_id,
                                                company_id:_selected_company_id,
                                                job_status_code:_filter_code
                                        };
                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                }
                                if(sql != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute(sql);
                                        var b = _query_records_num;
                                        _query_records_num += rows.getRowCount();    
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        if((rows.fieldByName('assigned_from') === null)||(rows.fieldByName('assigned_from') === '')){
                                                                var status_colour = '';
                                                                var status_name = '';
                                                                var status_description = '';
                                                                for(var i=0,j=_status_code_array.length;i<j;i++){
                                                                        if(_status_code_array[i].code == rows.fieldByName(_type+'_status_code')){
                                                                                status_colour = _status_code_array[i].colour;
                                                                                status_name  = _status_code_array[i].name;
                                                                                status_description = _status_code_array[i].description;
                                                                                break;
                                                                        }
                                                                }                                                                   
                                                                var params = {
                                                                        is_header:(b === 0)?true:false,
                                                                        header_text:'Not Scheduled',
                                                                        job_type:_type,
                                                                        job_title:rows.fieldByName('title'),
                                                                        job_id:rows.fieldByName('id'),
                                                                        job_reference_number:rows.fieldByName('reference_number'),
                                                                        job_status_code:rows.fieldByName(_type+'_status_code'),
                                                                        class_name:'show_'+_type+'_row_'+b,
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
                                        rows.close();
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
                                var sql = '';
                                var sql_params = null;
                                if(_filter_code === -1){
                                        switch(_filter_class){
                                                case 'find_job_strata_plan_number':
                                                case 'find_quote_strata_plan_number':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:true,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'assigned_from desc',                                                            
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.sp like \'%'+_query_value+'%\'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;
                                                case 'find_job_order_reference_number':
                                                case 'find_quote_order_reference_number':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:true,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'assigned_from desc',                                                            
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.order_reference like \'%'+_query_value+'%\'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;  
                                                case 'find_job_title':
                                                case 'find_quote_title':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:true,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'assigned_from desc',                                                            
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'my_'+_type+'.title like \'%'+_query_value+'%\'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;                                                                 
                                                case 'find_job_address':
                                                case 'find_quote_address':
                                                case 'find_job_date':
                                                case 'find_quote_date':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:false,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'my_'+_type+'.reference_number desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:_query_value,
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;                                                          
                                                case 'all_jobs':
                                                case 'all_quotes':
                                                        sql_params ={
                                                                is_task:false,
                                                                is_calendar:false,//in calendar or in filter
                                                                is_scheduled:true,//query assigned_from is not null
                                                                is_check_changed:false,//check changed field or not
                                                                is_check_self_job:false,//only check current user's job
                                                                order_by:'assigned_from desc',
                                                                extra_left_join_condition:'',
                                                                extra_where_condition:'',
                                                                type:_type,
                                                                user_id:_selected_user_id,
                                                                company_id:_selected_company_id,
                                                                job_status_code:-1
                                                        };
                                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                                        break;
                                        }
                                }else{
                                        sql_params ={
                                                is_task:false,
                                                is_calendar:false,//in calendar or in filter
                                                is_scheduled:true,//query assigned_from is not null
                                                is_check_changed:false,//check changed field or not
                                                is_check_self_job:false,//only check current user's job
                                                order_by:'assigned_from desc',
                                                extra_left_join_condition:'',
                                                extra_where_condition:_type+'_status_code='+_filter_code,
                                                type:_type,
                                                user_id:_selected_user_id,
                                                company_id:_selected_company_id,
                                                job_status_code:_filter_code
                                        };
                                        sql = self.setup_sql_query_for_display_job_list(sql_params);
                                }

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
                                                                        var assigned_user_rows = db.execute('SELECT count(*) as count FROM my_'+_type+'_assigned_user WHERE status_code=1 and '+_type+'_id=?',rows.fieldByName('id'));
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
                                                                        if(_status_code_array[i].code == rows.fieldByName(_type+'_status_code')){
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
                                                                        job_type:_type,
                                                                        job_title:rows.fieldByName('title'),
                                                                        job_id:rows.fieldByName('id'),
                                                                        job_reference_number:rows.fieldByName('reference_number'),
                                                                        job_status_code:rows.fieldByName(_type+'_status_code'),
                                                                        class_name:'show_'+_type+'_row_'+b,
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
                 * display "download more jobs" row
                 */
                function _add_download_more_jobs_row_on_bottom(){
                        try{                                
                                var row = Ti.UI.createTableViewRow({
                                        height:'auto',
                                        job_type:self.current_selected_calendar_type_in_list,
                                        className:'download_more_jobs_on_bottom'
                                });                
                
                                var download_more_results = Ti.UI.createLabel({
                                        text:"Download More Results ...",
                                        width:300,
                                        top:5,
                                        bottom:45,
                                        height:20,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:15,
                                                fontWeight:"bold"
                                        }
                                });        
                                row.add(download_more_results);
                                
                                //status name
                                if(_filter_code != -1){
                                        var status_name_label = Ti.UI.createLabel({
                                                text:'(Status : '+_filter_code_name+')',
                                                width:300,
                                                bottom:25,
                                                height:12,
                                                color:"#576c89",
                                                textAlign:"center",
                                                font:{
                                                        fontSize:12
                                                }
                                        });        
                                        row.add(status_name_label);                                         
                                }else{
                                        status_name_label = Ti.UI.createLabel({
                                                text:'',
                                                width:300,
                                                bottom:25,
                                                height:12,
                                                color:"#576c89",
                                                textAlign:"center",
                                                font:{
                                                        fontSize:12
                                                }
                                        });                                          
                                        switch(_filter_class){
                                                case 'all_jobs':
                                                case 'all_quotes':
                                                        status_name_label.text = '(Status : '+' All '+self.ucfirst(_type)+'s)';                                                                                                             
                                                        break;
                                                case 'unassigned_jobs':
                                                case 'unassigned_quotes':
                                                        status_name_label.text = '(Status : '+' Unassigned '+self.ucfirst(_type)+'s)';                                                                                                             
                                                        break;                                                        
                                                case 'find_job_number':          
                                                case 'find_quote_number':
                                                        status_name_label.text = '(Searched By '+self.ucfirst(_type)+' Number : '+_query_value+')';                                                               
                                                        break;
                                                case 'find_job_strata_plan_number':
                                                case 'find_quote_strata_plan_number':
                                                        status_name_label.text = '(Searched By Strata Plan Number : '+_query_value+')';    
                                                        break;
                                                case 'find_job_order_reference_number':
                                                case 'find_quote_order_reference_number':
                                                        status_name_label.text = '(Searched By Order Reference Number : '+_query_value+')';    
                                                        break;
                                                case 'find_job_title':
                                                case 'find_quote_title':
                                                        status_name_label.text = '(Searched By Title : '+_query_value+')';    
                                                        break;                                                        
                                                case 'find_job_address':
                                                case 'find_quote_address':
                                                        status_name_label.text = '(Searched By Address)';  
                                                        break;
                                                case 'find_job_date':
                                                case 'find_quote_date':
                                                        status_name_label.text = '(Searched By Date)';  
                                                        break;                                                        
                                        }  
                                        row.add(status_name_label);    
                                }
                                
                                          
                                var total_my_jobs_on_server = Ti.UI.createLabel({
                                        text:'Total '+_job_or_quote_number_on_server+' '+self.ucfirst(_type)+((_job_or_quote_number_on_server>1)?'s':'')+', Displaying '+_downloade_job_or_quote_number+' '+self.ucfirst(_type)+((_downloade_job_or_quote_number>1)?'s':''),
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
                                
                                switch(_filter_class){
                                        case 'find_job_number':          
                                        case 'find_quote_number':
                                        case 'find_job_strata_plan_number':
                                        case 'find_quote_strata_plan_number':
                                        case 'find_job_order_reference_number':
                                        case 'find_quote_order_reference_number':
                                        case 'find_job_title':
                                        case 'find_quote_title':                                        
                                        case 'find_job_address':
                                        case 'find_quote_address':
                                        case 'find_job_date':
                                        case 'find_quote_date':
                                                if(Ti.Network.online){
                                                        total_my_jobs_on_server.text ='Total '+_total_search_result+' '+self.ucfirst(_type)+((_total_search_result>1)?'s':'')+', Displaying '+_downloade_job_or_quote_number+' '+self.ucfirst(_type)+((_downloade_job_or_quote_number>1)?'s':'');                                                              
                                                }else{
                                                        total_my_jobs_on_server.text ='Total '+(self.data.length-1)+' '+self.ucfirst(_type)+((_job_or_quote_number_on_server>1)?'s':'')+', Displaying '+_downloade_job_or_quote_number+' '+self.ucfirst(_type)+((_downloade_job_or_quote_number>1)?'s':'');
                                                }                                                                                                
                                                break;
                                }                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_download_more_jobs_row_on_bottom');
                                return;
                        }
                }
                /**
                 *  get my job or quote number of server 
                 */
                function _get_my_job_or_quote_number(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());                
                                var rows = db.execute('SELECT * FROM my_summary where id=?',_selected_user_id);
                                if(rows.isValidRow()){
                                        if(_filter_code === -1){
                                                if(_type === 'job'){
                                                        if(_filter_class == 'all_jobs'){
                                                                _job_or_quote_number_on_server = rows.fieldByName('job_total_number_on_server');                    
                                                        }
                                                        if(_filter_class == 'unassigned_jobs'){
                                                                _job_or_quote_number_on_server = rows.fieldByName('unassigned_job_total_number_on_server');                    
                                                        }                                                        
                                                }else{
                                                        if(_filter_class == 'all_quotes'){
                                                                _job_or_quote_number_on_server = rows.fieldByName('quote_total_number_on_server');                    
                                                        }
                                                        if(_filter_class == 'unassigned_quotes'){
                                                                _job_or_quote_number_on_server = rows.fieldByName('unassigned_quote_total_number_on_server');                    
                                                        }                                                          
                                                }  
                                        }else{
                                                if(_type === 'job'){
                                                        var job_status_number_on_server = rows.fieldByName('job_status_number_on_server');                    
                                                        var job_status_number_on_server_array = job_status_number_on_server.split(',');
                                                        if(job_status_number_on_server_array.length > 0){
                                                                for(var i=0,j=job_status_number_on_server_array.length;i<j;i++){
                                                                        var temp_array = job_status_number_on_server_array[i].split(':');
                                                                        if(temp_array.length > 1){
                                                                                if(temp_array[0] == _filter_code){
                                                                                        _job_or_quote_number_on_server = temp_array[1];
                                                                                        break;
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                }else{
                                                        var quote_status_number_on_server = rows.fieldByName('quote_status_number_on_server');     
                                                        var quote_status_number_on_server_array = quote_status_number_on_server.split(',');
                                                        if(quote_status_number_on_server_array.length > 0){
                                                                for(i=0,j=quote_status_number_on_server_array.length;i<j;i++){
                                                                        temp_array = quote_status_number_on_server_array[i].split(':');
                                                                        if(temp_array.length > 1){
                                                                                if(temp_array[0] == _filter_code){
                                                                                        _job_or_quote_number_on_server = temp_array[1];
                                                                                        break;
                                                                                }
                                                                        }
                                                                }
                                                        }   
                                                } 
                                        }                                
                                }
                                rows.close();

                                Ti.API.info('_job_or_quote_number_on_server:'+_job_or_quote_number_on_server);

                                var sql = '';
                                if(_type === 'job'){
                                        sql = 'SELECT count(*) as count from my_job where my_job.company_id=? and my_job.status_code=1 and my_job.is_task=0 and my_job.id < 1000000000';
                                        if(_filter_code === -1){
                                                switch(_filter_class){
                                                        case 'all_jobs':
                                                                rows = db.execute(sql,_selected_company_id);
                                                                break;
                                                        case 'unassigned_jobs':
                                                                rows = db.execute(sql+' and my_job.id not in(select distinct(a.job_id) from my_job_assigned_user as a where a.status_code=1)',_selected_company_id);
                                                                break;                                                                
                                                        case 'find_job_number':
                                                                rows = db.execute(sql+' and my_job.'+_query_field+'=?',_selected_company_id,_query_value);
                                                                break;
                                                        case 'find_job_strata_plan_number':
                                                        case 'find_job_order_reference_number':
                                                        case 'find_job_title':
                                                                rows = db.execute(sql+' and my_job.'+_query_field+' like \'%'+_query_value+'%\'',_selected_company_id);
                                                                break;                                                                 
                                                        case 'find_job_address':    
                                                        case 'find_job_date':
                                                                rows = db.execute(sql+' and '+_query_value,_selected_company_id);
                                                                break;                                                             
                                                }                                                
                                        }else{
                                                rows = db.execute(sql+' and my_job.job_status_code=?',_selected_company_id,_filter_code);
                                        }
                                        if(rows.isValidRow()){
                                                _downloade_job_or_quote_number = rows.fieldByName('count');
                                        }
                                        rows.close();
                                }else{            
                                        sql = 'SELECT count(*) as count from my_quote where my_quote.company_id=? and my_quote.is_task=0 and my_quote.id < 1000000000 and my_quote.status_code=1';
                                        if(_filter_code === -1){
                                                switch(_filter_class){
                                                        case 'all_quotes':
                                                                rows = db.execute(sql,_selected_company_id);
                                                                break;
                                                        case 'unassigned_quotes':
                                                                rows = db.execute(sql+' and my_quote.id not in(select distinct(a.quote_id) from my_quote_assigned_user as a where a.status_code=1)',_selected_company_id);
                                                                break;                                                                    
                                                        case 'find_quote_number':
                                                                rows = db.execute(sql+' and my_quote.'+_query_field+' =?',_selected_company_id,_query_value);
                                                                break;
                                                        case 'find_quote_strata_plan_number':
                                                        case 'find_quote_order_reference_number':
                                                        case 'find_quote_title':
                                                                rows = db.execute(sql+' and my_quote.'+_query_field+' like \'%'+_query_value+'%\'',_selected_company_id);
                                                                break;                                                                  
                                                        case 'find_quote_address':
                                                        case 'find_quote_date':
                                                                rows = db.execute(sql+' and '+_query_value,_selected_company_id);
                                                                break;
                                                }                                                                                                
                                        }else{
                                                rows = db.execute(sql+' and my_quote.quote_status_code=?',_selected_company_id,_filter_code);
                                        }
                                        if(rows.isValidRow()){
                                                _downloade_job_or_quote_number = rows.fieldByName('count');
                                        }
                                        rows.close();  
                                }                
                                db.close();                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_my_job_or_quote_number');
                                return;
                        }
                }                       
        }
    
        win.addEventListener('open',function(){
                try{                        
                        if(filter_job_filter_page_obj === null){
                                Ti.App.Properties.setBool('refresh_list',false);
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                filter_job_filter_page.prototype = new F();
                                filter_job_filter_page.prototype.constructor = filter_job_filter_page;
                                filter_job_filter_page_obj = new filter_job_filter_page();
                                filter_job_filter_page_obj.init();
                        }
                        filter_job_filter_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        filter_job_filter_page_obj.close_window();
                        filter_job_filter_page_obj = null;
                        win = null; 
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

