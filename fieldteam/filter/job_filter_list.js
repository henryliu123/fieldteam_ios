/**
 *  Description: job filter list
 */

(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var filter_job_filter_list_page_obj = null;

        function filter_job_filter_list_page(){
                var self = this;
                var window_source = 'filter_job_filter_list_page';
                win.title = 'Search By';//self.ucfirst(win.type)+' Filter';

                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{                               
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Add','Main,Back');
                                self.init_vars();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return; 
                        }
                };
                /**
                 *  override init_vars  function of parent class: fieldteam.js
                 */         
                self.init_vars = function(){
                        try{                              
                                self.data = [
                                {
                                        title:'All '+self.ucfirst(win.type)+'s',
                                        code:-1,
                                        hasChild:true,
                                        filter_class:'all_'+win.type+'s',
                                        className:'all_'+win.type+'s'
                                },
                                {
                                        title:'Unassigned '+self.ucfirst(win.type)+'s',
                                        code:-1,
                                        hasChild:true,
                                        filter_class:'unassigned_'+win.type+'s',
                                        className:'unassigned_'+win.type+'s'
                                //leftImage:self.get_file_path('image', 'job_filter/job_all_jobs.png')
                                } ,                                        
                                {
                                        title:'Search By Fields',
                                        code:-1,
                                        hasChild:true,
                                        filter_class:'search_by_fields',
                                        className:'search_by_fields'
                                },                                        
                                {
                                        title:'Search By Status',
                                        code:-1,
                                        hasChild:true,
                                        filter_class:'search_by_status',
                                        className:'search_by_status'
                                }                                                                                
                                ];
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
                                var new_model_win = null;

                                switch(e.row.filter_class){
                                        case 'all_jobs':
                                        case 'all_quotes':
                                                new_model_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url','filter/job_filter.js'),
                                                        source_name:'job_filter',
                                                        filter_class:e.row.filter_class,
                                                        query_value:'',
                                                        query_field:'',      
                                                        filter_code:e.row.code,
                                                        title_value:e.row.title,
                                                        type:win.type
                                                });
                                                Ti.UI.currentTab.open(new_model_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                break; 
                                        case 'unassigned_jobs':
                                        case 'unassigned_quotes':
                                                new_model_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url','filter/job_filter.js'),
                                                        source_name:'job_filter',
                                                        filter_class:e.row.filter_class,
                                                        query_value:'',
                                                        query_field:'',      
                                                        filter_code:e.row.code,
                                                        title_value:e.row.title,
                                                        type:win.type
                                                });
                                                Ti.UI.currentTab.open(new_model_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });  
                                                break;
                                        case 'search_by_fields':
                                                self.searchByFieldsList = (self.is_ipad())?[self.ucfirst(win.type)+' Number','Strata Plan Number','Order Reference Number',self.ucfirst(win.type)+' Address',self.ucfirst(win.type)+' Title','Date Created','Cancel','']:[self.ucfirst(win.type)+' Number','Strata Plan Number','Order Reference Number',self.ucfirst(win.type)+' Address',self.ucfirst(win.type)+' Title','Date Created','Cancel'];
                                                var optionDialog = Ti.UI.createOptionDialog({
                                                        options:self.searchByFieldsList,
                                                        buttonNames:['Cancel'],
                                                        destructive:0,
                                                        cancel:(self.is_ipad()?self.searchByFieldsList.length-2:self.searchByFieldsList.length-1),
                                                        title:'Please select search type.'
                                                });
                                                optionDialog.show();
                                                optionDialog.addEventListener('click',function(evt){

                                                        switch(evt.index){
                                                                case 0://job number or quote number
                                                                        new_model_win = Ti.UI.createWindow({
                                                                                url:self.get_file_path('url','filter/job_filter_modal_window.js'),
                                                                                filter_class:'find_'+win.type+'_number',
                                                                                query_value:'',
                                                                                query_field:'reference_number',
                                                                                title_value:self.searchByFieldsList[evt.index],
                                                                                filter_code:-1,
                                                                                win_keyboard_type:Titanium.UI.KEYBOARD_NUMBER_PAD,
                                                                                type:win.type
                                                                        });
                                                                        break;                                                                                        
                                                                case 1://Strata Plan Number
                                                                        new_model_win = Ti.UI.createWindow({
                                                                                url:self.get_file_path('url','filter/job_filter_modal_window.js'),
                                                                                filter_class:'find_'+win.type+'_strata_plan_number',
                                                                                query_value:'',
                                                                                query_field:'sp',
                                                                                title_value:self.searchByFieldsList[evt.index],
                                                                                filter_code:-1,
                                                                                type:win.type
                                                                        });
                                                                        break;
                                                                case 2://Order Reference Number
                                                                        new_model_win = Ti.UI.createWindow({
                                                                                url:self.get_file_path('url','filter/job_filter_modal_window.js'),
                                                                                filter_class:'find_'+win.type+'_order_reference_number',
                                                                                query_value:'',
                                                                                query_field:'order_reference',
                                                                                title_value:self.searchByFieldsList[evt.index],
                                                                                filter_code:-1,
                                                                                type:win.type
                                                                        });
                                                                        break;                
                                                                case 3://address
                                                                        new_model_win = Ti.UI.createWindow({
                                                                                url:self.get_file_path('url','filter/job_filter_address.js'),
                                                                                filter_class:'find_'+win.type+'_address',
                                                                                query_value:'',
                                                                                query_field:'',
                                                                                title_value:self.searchByFieldsList[evt.index],
                                                                                filter_code:-1,
                                                                                type:win.type
                                                                        });
                                                                        break;      
                                                                case 4://title
                                                                        new_model_win = Ti.UI.createWindow({
                                                                                url:self.get_file_path('url','filter/job_filter_modal_window.js'),
                                                                                filter_class:'find_'+win.type+'_title',
                                                                                query_value:'',
                                                                                query_field:'title',
                                                                                title_value:self.searchByFieldsList[evt.index],
                                                                                filter_code:-1,
                                                                                type:win.type
                                                                        });
                                                                        break;      
                                                                case 5://date created
                                                                        new_model_win = Ti.UI.createWindow({
                                                                                url:self.get_file_path('url','filter/job_filter_date.js'),
                                                                                filter_class:'find_'+win.type+'_date',
                                                                                query_value:'',
                                                                                query_field:'',
                                                                                title_value:self.searchByFieldsList[evt.index],
                                                                                filter_code:-1,
                                                                                type:win.type
                                                                        });
                                                                        break;
                                                        }   
                                                        if(evt.index <=5){
                                                                Ti.UI.currentTab.open(new_model_win,{
                                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                });                        
                                                        }
                                                });                                                        
                                                break;   
                                        case 'search_by_status':
                                                self.searchByStatusList = [];
                                                self.searchByStatusTitleList = [];
                                                var db = Titanium.Database.open(self.get_db_name());
                                                var row = db.execute('SELECT * FROM my_'+win.type+'_status_code'); 
                                                while(row.isValidRow()){
                                                        self.searchByStatusTitleList.push(row.fieldByName('name'));
                                                        var temp_var = {
                                                                title : row.fieldByName('name'),
                                                                code: row.fieldByName('code'),
                                                                hasChild:true,
                                                                filter_class:row.fieldByName('name').toLowerCase(),
                                                                className:row.fieldByName('name').toLowerCase()
                                                        //leftImage:self.get_file_path('image', win.type+'_filter/'+win.type+'_'+row.fieldByName('description')+'.png')
                                                        };
                                                        self.searchByStatusList.push(temp_var);
                                                        row.next();
                                                }
                                                row.close();
                                                db.close();             
                                                self.searchByStatusTitleList.push("Cancel");
                                                if(self.is_ipad()){
                                                        self.searchByStatusTitleList.push("");
                                                }
                                                optionDialog = Ti.UI.createOptionDialog({
                                                        options:self.searchByStatusTitleList,
                                                        buttonNames:['Cancel'],
                                                        destructive:0,
                                                        cancel:(self.is_ipad()?self.searchByStatusTitleList.length-2:self.searchByStatusTitleList.length-1),
                                                        title:'Please select status type.'
                                                });
                                                optionDialog.show();
                                                optionDialog.addEventListener('click',function(evt){                                                        
                                                        switch(evt.index){
                                                                default:
                                                                        if(self.searchByStatusTitleList[evt.index] == 'Cancel'){
                                                                                        
                                                                        }else{
                                                                                var filter_class = self.searchByStatusList[evt.index].filter_class;
                                                                                var filter_code = self.searchByStatusList[evt.index].code;
                                                                                var filter_title = self.searchByStatusList[evt.index].title;                                                        
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
                                                                                                                new_model_win = Ti.UI.createWindow({
                                                                                                                        url:self.get_file_path('url','filter/job_filter.js'),
                                                                                                                        pull_down_refresh:true,
                                                                                                                        filter_class:filter_class,
                                                                                                                        query_value:'',
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
                                                                                                                        error_source:window_source+' - self.table_view_click_event - xhr.onload - 1',
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
                                                                                                                error_source:window_source+' - self.table_view_click_event - xhr.onload - 2',
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
                                                                                                        error_source:window_source+' - self.table_view_click_event - xhr.onerror',
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
                                                                                                'query_value':'',
                                                                                                'job_type':win.type,
                                                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                                                'app_version_increment':self.version_increment,
                                                                                                'app_version':self.version,
                                                                                                'app_platform':self.get_platform_info()
                                                                                        });     
                                                                                }else{
                                                                                        new_model_win = Ti.UI.createWindow({
                                                                                                url:self.get_file_path('url','filter/job_filter.js'),
                                                                                                pull_down_refresh:true,
                                                                                                filter_class:filter_class,
                                                                                                query_value:'',
                                                                                                query_field:'',
                                                                                                filter_code:filter_code,
                                                                                                title_value:filter_title,
                                                                                                type:win.type,
                                                                                                total_search_result:0
                                                                                        });
                                                                                        Ti.UI.currentTab.open(new_model_win,{
                                                                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                                        });
                                                                                }        
                                                                        }
                                                                        break;                                                                           
                                                        }
                                                });                                                        
                                                break;                                                                                                               
                                                                                             
                                }
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return; 
                        }
                };                                
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
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
                
                //private memeber
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');                    
        }
    
        win.addEventListener('focus',function(){
                try{                        
                        if(filter_job_filter_list_page_obj === null){
                                Ti.App.Properties.setBool('refresh_list',false);
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                filter_job_filter_list_page.prototype = new F();
                                filter_job_filter_list_page.prototype.constructor = filter_job_filter_list_page;
                                filter_job_filter_list_page_obj = new filter_job_filter_list_page();
                                filter_job_filter_list_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        filter_job_filter_list_page_obj.close_window();
                        filter_job_filter_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
