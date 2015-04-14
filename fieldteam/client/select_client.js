/**
 *  Function List:
 *  1. Display Client List
 *  2. More Client Button for display more clients
 *  3. Download More Client button for downloading more clients from server
 *  4. Add Client Button
 *  5. Click any client and enter client edit page
 *  6. Search bar
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;    
        var client_select_client_page_obj = null;

        function client_select_client_page(){
                var self = this;
                var window_source = 'client_select_client_page';
                win.title = 'Select Client';
                
                //public member 
                self.pull_down_to_update = false;
                self.pull_down_to_download_more = true;                

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
                                _init_search_bar();
                                _init_bottom_bar();          
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();                                
                                self.table_view.top = self.tool_bar_height;
                                self.table_view.bottom = self.tool_bar_height;
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_selected_field_object != null){
                                                self.searchBar.blur();
                                        }
                                });                                 
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
                                if(_selected_client_id <= 0){
                                        self.show_message(L('message_select_client_in_select_client'));
                                        return;
                                }
                                var option_dialog = null;
                                option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:'Do you want to set job address with client\'s address?'
                                });                                        
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){     
                                        switch(evt.index){
                                                case 0:
                                                        _set_job_address_with_client_address = true;
                                                        _save_selected_client(e);
                                                        break;
                                                case 1:
                                                        _set_job_address_with_client_address = false;
                                                        _save_selected_client(e);
                                                        break;
                                        }
                                });                                                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                        
                };
                /**
                         *  override nav_left_btn_click_event function of parent class: transaction.js
                         */                     
                self.nav_left_btn_click_event = function(e){
                        try{
                                if(_selected_client_id != win.client_id){
                                        var option_dialog = Ti.UI.createOptionDialog({
                                                options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                                buttonNames:['Cancel'],
                                                destructive:0,
                                                cancel:2,
                                                title:L('message_save_changes')
                                        });
                                        option_dialog.show();
                                        option_dialog.addEventListener('click',function(evt){
                                                switch(evt.index){
                                                        case 0:
                                                                self.nav_right_btn_click_event(e);
                                                                break;
                                                        case 1:
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                                break;
                                                        case 2://cancel
                                                                self.nav_left_btn.index = -1;
                                                                break;                                                                     
                                                }
                                        });                                          
                                }else{
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_left_btn_click_event');
                                return;
                        }                          
                };                     
                /**
                         *  override table_view_click_event function of parent class: transaction.js
                         */                  
                self.table_view_click_event = function(e){
                        try{                           
                                if(e.source.name === 'view_btn'){
                                        var view_client_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url', 'job/edit/job_client_view.js'),
                                                type:_type,
                                                job_id:_selected_job_id,
                                                job_reference_number:_selected_job_reference_number,
                                                client_id:e.row.client_id,
                                                client_reference_number:e.row.client_reference_number,
                                                client_type_code:e.row.client_type_code,
                                                action_for_client:'view_client',
                                                parent_win:win
                                        });
                                        Titanium.UI.currentTab.open(view_client_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });                                        
                                }else{                                
                                        var row  = e.row;  
                                        var filter_class = row.filter_class;
                                        switch(filter_class){
                                                case 'client_class':
                                                        if(row != _selected_row){
                                                                row.hasCheck = true;     
                                                                if(_selected_row != null){
                                                                        _selected_row.hasCheck = false;
                                                                }
                                                                _selected_row = row;
                                                                _selected_client_id = row.client_id;
                                                        }else{
                                                                if(_selected_row.hasCheck){
                                                                        _selected_row.hasCheck = false;
                                                                        _selected_client_id = 0;
                                                                }else{
                                                                        _selected_row.hasCheck = true;
                                                                        _selected_client_id = row.client_id;
                                                                }
                                                        }
                                                        
                                                        
                                                        break;
                                                case 'download_more_clients':
                                                        self.begin_download_more_jobs_by_scroll_down();
                                                        break;
                                        }                                                  
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }
                };                                  
                /**
                 * create pull down view
                 */
                self.init_pull_down_view = function(){
                        var self = this;
                        try{                                                            
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
                                        height:80
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
                                        bottom:65,
                                        height:20,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12,
                                                fontWeight:"bold"
                                        }
                                });   
                                
                                self.total_my_jobs_on_server = Ti.UI.createLabel({
                                        text:'Total '+_total_item_amount_on_server+' item'+((_total_item_amount_on_server>1)?'s':'')+', Downloaded '+_downloaded_item_amount+' item'+((_downloaded_item_amount>1)?'s':''),
                                        width:self.screen_width,
                                        left:30,
                                        bottom:45,
                                        height:20,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12
                                        }
                                });      
                                
                                self.displaying_my_jobs_on_server = Ti.UI.createLabel({
                                        text:'Displaying '+_displaying_item_amount+' item'+((_displaying_item_amount>1)?'s':''),
                                        width:self.screen_width,
                                        left:30,
                                        bottom:30,
                                        height:12,
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
                                table_view_header.add(self.displaying_my_jobs_on_server);
                                table_view_header.add(pull_view_last_updated);
                                return table_view_header;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_pull_down_view');
                                return null;
                        }
                };                
                /**
                         *  override begin_download_more_jobs_by_scroll_down function of parent class: transaction.js
                         *  but in fact , just download more client
                         */    
                self.begin_download_more_jobs_by_scroll_down = function(){
                        try{                
                                if(Ti.Network.online){
                                        self.display_indicator('Loading Data ...');
                                        var client_id_array = [];
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT id FROM my_client where company_id=? and status_code=1',_selected_company_id);
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        client_id_array.push(rows.fieldByName('id'));
                                                        rows.next();
                                                }
                                        }
                                        rows.close();
                                        db.close();
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
                                                                if(this.responseText != '[]'){
                                                                        self.update_selected_tables(null,'Client',JSON.parse(this.responseText));        
                                                                        self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));    
                                                                }
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                        }else{
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                                var params = {
                                                                        message:'Download client failed.',
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
                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                        params = {
                                                                message:'Download client failed.',
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
                                                self.end_download_more_jobs_by_scroll_down(true);
                                                var params = {
                                                        message:'Download client failed.',
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
                                                'type':'get_client_list_from_server_with_id_array',
                                                'hash':_selected_user_id,
                                                'user_id':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'search_string':_search_text,
                                                'limit':self.count_for_job_query,
                                                'client_id_string':client_id_array.join(','),
                                                'client_type_code':_selected_client_type_code,
                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                'app_version_increment':self.version_increment,
                                                'app_version':self.version,
                                                'app_platform':self.get_platform_info()
                                        });
                                }else{
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
                /**
                         * display client list . Show letter index if client count great than 10
                         */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                if(_selected_client_type_code > 0){
                                        if(_can_view_business_client){
                                                _get_client_list(_selected_client_type_code,false);
                                        }else{
                                                if(_selected_client_type_code != 1){
                                                        _get_client_list(_selected_client_type_code,false);
                                                }
                                        }                                        
                                }else{
                                        if(_can_view_business_client){
                                                _get_client_list(1,false);
                                        }
                                        _get_client_list(2,false);                                        
                                }                                
                                _add_download_more_clients();   
                                _update_last_row_text();                                    
                                self.table_view.setData(self.data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.DOWN
                                });
                                setTimeout(function(){
                                        self.hide_indicator();
                                },500);                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };


                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_client_id = win.client_id;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _type = win.job_type;
                var _search_text = '';
                var _header_view_button_width = 60;
                var _header_view_button_height = 26;
                var _header_view_font_size = 16;        
                var _set_job_address_with_client_address = false;

                
                var _total_item_amount_on_server = 0;
                var _total_business_client_amount_on_server = 0;
                var _total_private_client_amount_on_server = 0;
                var _downloaded_item_amount = 0;
                var _displaying_item_amount = 0;
                var _last_row_title_label = null;
                var _last_row_text_label = null;
                var _last_row_displaying_text_label = null;
                var _selected_row = null;
                var _selected_field_object = null;
                var _can_view_business_client = Titanium.App.Properties.getBool('can_view_business_client');
                var _selected_client_type_code=(_can_view_business_client)?0:2;//0:all,1:business,2:private
                //private method
                /**
                         * init search tool bar
                         */
                function _init_search_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });

                                self.searchBar = Ti.UI.createSearchBar({
                                        showCancel:false,
                                        hintText:'Search Client',
                                        autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
                                        height:self.tool_bar_height,
                                        width:self.screen_width
                                });
                                var searchToolbar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.searchBar,flexSpace],
                                        top:0,
                                        buttom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1
                                });
                                win.add(searchToolbar);

                                self.searchBar.addEventListener('change',function(e){
                                        self.searchBar.showCancel = true;
                                        _search_text = e.value;
                                        _search_text = self.replace(_search_text,'\"','');//remove " symbol
                                        _search_text = self.replace(_search_text,'\'','');//remove ' symbol'                                           
                                        self.display();
                                });

                                self.searchBar.addEventListener('return',function(e){
                                        self.searchBar.blur();
                                        self.searchBar.showCancel = false;
                                        _search_text = e.value;
                                        _search_text = self.replace(_search_text,'\"','');//remove " symbol
                                        _search_text = self.replace(_search_text,'\'','');//remove ' symbol'                                           
                                        self.begin_download_more_jobs_by_scroll_down();
                                });

                                self.searchBar.addEventListener('cancel',function(e){
                                        self.searchBar.value = '';
                                        self.searchBar.blur();
                                        self.searchBar.showCancel = false;
                                        _search_text = '';
                                        self.display();
                                });

                                self.searchBar.addEventListener('focus', function(e){
                                        self.searchBar.showCancel = true;
                                        _selected_field_object = e.source;
                                });

                                self.searchBar.addEventListener('blur', function(e){
                                        self.searchBar.showCancel = false;
                                        _selected_field_object = null;
                                });                                                                       
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_search_bar');
                                return;
                        }                        
                }      
                /**
                         * init bottom tool bar
                         */                
                function _init_bottom_bar(){
                        try{
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                }); 
                                self.client_type_btn_bar = Titanium.UI.iOS.createTabbedBar({
                                        labels:['All', 'Business' ,'Private'],
                                        style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
                                        backgroundColor:'#336699',
                                        height:30,
                                        width:180,
                                        index:0,
                                        visible:(_can_view_business_client)?true:false
                                });                                
                                                                
                                self.add_client_btn_bar = Titanium.UI.createButtonBar({
                                        labels:['Create Client'],
                                        backgroundColor:'#336699'
                                });

                                var bottomToolBar = Ti.UI.iOS.createToolbar({
                                        items:[self.add_client_btn_bar,flexSpace,self.client_type_btn_bar],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100                                        
                                });
                                if(self.is_ios_7_plus()){
                                        bottomToolBar.barColor = self.default_tool_bar_background_color;
                                        self.client_type_btn_bar.backgroundColor = self.set_table_view_header_backgroundcolor;  
                                        self.add_client_btn_bar.backgroundColor = self.set_table_view_header_backgroundcolor;    
                                }                                   
                                win.add(bottomToolBar);
                                
                                self.add_client_btn_bar.addEventListener('click',function(e){
                                        _add_btn_click_event(e);
                                });            
                                
                                self.client_type_btn_bar.addEventListener('click',function(e){
                                        _client_type_click_event(e);
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_bar');
                                return;
                        }
                }
                /**
                         *  add client event
                         */
                function _add_btn_click_event(e){
                        try{
                                var btnIndex = e.index;
                                if(btnIndex === 0){
                                        var add_client_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','client/edit_client.js'),
                                                client_id:0,
                                                client_reference_number:0,
                                                action_for_client:'add_client'
                                        });
                                        Titanium.UI.currentTab.open(add_client_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_btn_click_event');
                                return;
                        }
                }
                /**
                 * client type click event
                 */
                function _client_type_click_event(e){
                        try{
                                _selected_client_type_code = e.index;
                                self.display();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _client_type_click_event');
                                return;
                        }                        
                }
                /** 
                         *  get client list
                         */
                function _get_client_list(client_type_code){
                        try{
                                var sql = '';
                                if(client_type_code > 0){
                                        sql = 'SELECT * FROM my_client WHERE company_id='+_selected_company_id+' and status_code=1 and client_type_code='+client_type_code;
                                }else{
                                        sql = 'SELECT * FROM my_client WHERE company_id='+_selected_company_id+' and status_code=1';
                                }
                                                                
                                var db = Titanium.Database.open(self.get_db_name());
                                var search_string = _search_text;
                                var rows = null;
                                if((search_string === '')||(search_string === null)||(search_string === undefined)){                                      
                                        sql +=' ORDER BY client_name ASC ';
                                        rows = db.execute(sql);                                        
                                }else{                                    
                                        sql += ' and ((client_name like \'%'+search_string+'%\') or (client_abbr like \'%'+search_string+'%\'))';
                                        sql +=' ORDER BY client_name ASC ';                                
                                        rows = db.execute(sql);
                                }       
                                var business_client_temp_count = 0;
                                var private_client_temp_count = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                if(rows.fieldByName('client_type_code') === 1){
                                                        business_client_temp_count++;
                                                }
                                                if(rows.fieldByName('client_type_code') === 2){
                                                        private_client_temp_count++;
                                                }      
                                                rows.next();
                                        }
                                }
                                rows.close();
                                db.close();
                                
                                //create row 
                                sql = '';
                                if(client_type_code > 0){
                                        sql = 'SELECT * FROM my_client WHERE company_id='+_selected_company_id+' and status_code=1 and client_type_code='+client_type_code;
                                }else{
                                        sql = 'SELECT * FROM my_client WHERE company_id='+_selected_company_id+' and status_code=1';
                                }
                                                                
                                db = Titanium.Database.open(self.get_db_name());
                                search_string = _search_text;
                                rows = null;
                                if((search_string === '')||(search_string === null)||(search_string === undefined)){                                      
                                        sql +=' ORDER BY client_name ASC ';
                                        rows = db.execute(sql);                                        
                                }else{                                    
                                        sql += ' and ((client_name like \'%'+search_string+'%\') or (client_abbr like \'%'+search_string+'%\'))';
                                        sql +=' ORDER BY client_name ASC ';                                
                                        rows = db.execute(sql);
                                }       
                                var n = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'client_class_'+client_type_code+'_'+n,
                                                        filter_class:'client_class',
                                                        client_id:rows.fieldByName('id'),
                                                        client_reference_number:rows.fieldByName('reference_number'),
                                                        client_type_code:rows.fieldByName('client_type_code'),
                                                        hasCheck:((rows.fieldByName('id') == _selected_client_id)?true:false)
                                                });
                                                if((rows.fieldByName('id') == _selected_client_id)){
                                                        _selected_row = row;
                                                }
                                                if(n === 0){
                                                        row.header  = (client_type_code === 1)?'Business('+business_client_temp_count+')':'Private('+private_client_temp_count+')';
                                                }
                                                var view_btn = Ti.UI.createButton({
                                                        name:'view_btn',
                                                        backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                        color:'#fff',
                                                        font:{
                                                                fontSize:_header_view_font_size-2,
                                                                fontWeight:'bold'
                                                        },
                                                        title:'View',
                                                        textAlign:'center',
                                                        style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
                                                        left:10,
                                                        top:5,
                                                        width:_header_view_button_width-5,
                                                        height:_header_view_button_height
                                                });
                                                row.add(view_btn);                                                  
                                                if(self.trim(rows.fieldByName('client_abbr')) != ''){
                                                        var title_label = Ti.UI.createLabel({
                                                                top:5,
                                                                left:10+_header_view_button_width,
                                                                width:self.screen_width-100,
                                                                text:rows.fieldByName('client_name'),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label);
                                                        var abbr_label = Ti.UI.createLabel({
                                                                bottom:3,
                                                                left:10+_header_view_button_width,
                                                                width:self.screen_width-100,
                                                                text:'['+rows.fieldByName('client_abbr')+']',
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(abbr_label);
                                                }else{
                                                        title_label = Ti.UI.createLabel({
                                                                left:10+_header_view_button_width,
                                                                width:self.screen_width-100,
                                                                text:rows.fieldByName('client_name'),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label);
                                                }
                                                self.data.push(row);                                               
                                                rows.next();
                                                n++;
                                        }
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_client_list');
                                return;
                        }                       
                }
                
                function _save_selected_client(e){
                        try{
                                //set address variables
                                var sub_no = '';
                                var unit_no = '';
                                var street_no = '';
                                var street = '';
                                var street_type = '';
                                var street_type_id = 0;
                                var suburb = '';
                                var postcode = '';
                                var suburb_id = 0;
                                var state = '';
                                var state_id = 0;
                                
                                var selected_client_name = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_client WHERE id=?',_selected_client_id);
                                if((rows.getRowCount() > 0) && (rows.isValidRow())){
                                        selected_client_name = rows.fieldByName('client_name');
                                        if(_set_job_address_with_client_address){
                                                sub_no = rows.fieldByName('sub_number');
                                                unit_no = rows.fieldByName('unit_number');
                                                street_no = rows.fieldByName('street_number');
                                                street = rows.fieldByName('street');
                                                street_type = rows.fieldByName('street_type');
                                                street_type_id = rows.fieldByName('locality_street_type_id');
                                                suburb = rows.fieldByName('suburb');
                                                postcode = rows.fieldByName('postcode');
                                                suburb_id = rows.fieldByName('locality_suburb_id');
                                                state_id = rows.fieldByName('locality_state_id');                                              
                                        }
                                }
                                rows.close();
                                db.close();
                                if((win.is_save_directly != undefined) && (win.is_save_directly) && (win.job_id != undefined)){                                        
                                        //check selected client id is equal old client id or not.
                                        if(_selected_client_id != win.client_id){
                                                db = Titanium.Database.open(self.get_db_name());
                                                if(_set_job_address_with_client_address){
                                                        db.execute('UPDATE my_'+win.job_type+' SET client_id=?,changed=1,'+
                                                                'sub_number=?,unit_number=?,street_number=?,street=?,street_type=?,'+
                                                                'locality_street_type_id=?,suburb=?,postcode=?,locality_suburb_id=?,locality_state_id=? '+
                                                                'WHERE id=?',_selected_client_id,sub_no,unit_no,street_no,street,
                                                                street_type,street_type_id,suburb,postcode,suburb_id,state_id,win.job_id);
                                                }else{
                                                        db.execute('UPDATE my_'+win.job_type+' SET client_id=?,changed=1 WHERE id=?',_selected_client_id,win.job_id);
                                                }
                                                db.close();
                                        }
                                }else{
                                        Ti.App.Properties.setBool('select_client_flag',true);
                                        Ti.App.Properties.setString('select_client_flag_client_id',_selected_client_id);
                                        Ti.App.Properties.setString('select_client_flag_client_content',selected_client_name);
                                        if(_set_job_address_with_client_address){
                                                Ti.App.Properties.setBool('edit_address_flag_in_select_client_flag',true);
                                                Ti.App.Properties.setString('edit_address_sub_number',sub_no);
                                                Ti.App.Properties.setString('edit_address_unit_number',unit_no);
                                                Ti.App.Properties.setString('edit_address_street_number',street_no);
                                                Ti.App.Properties.setString('edit_address_street',street);
                                                Ti.App.Properties.setString('edit_address_street_type',street_type);
                                                Ti.App.Properties.setString('edit_address_suburb',suburb);
                                                Ti.App.Properties.setString('edit_address_postcode',postcode);
                                                Ti.App.Properties.setString('edit_address_state',state);
                                                Ti.App.Properties.setString('edit_address_stateID',state_id);
                                                Ti.App.Properties.setString('edit_address_street_type_id',street_type_id);
                                                Ti.App.Properties.setString('edit_address_suburb_id',suburb_id);
                                                Ti.App.Properties.setString('edit_address_latitudeText',0);
                                                Ti.App.Properties.setString('edit_address_longitudeText',0);                                             
                                        }
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save_selected_client');
                                return;                                
                        }
                }             
                /**
                 * refresh total_business_client_amount,total_private_client_amount,downlaoded_client_amount,displaying_client_amount;
                 */
                function _update_last_row_text(){
                        try{                                
                                _displaying_item_amount = self.data.length-1;
                             
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('select * from my_summary where id=?',_selected_user_id);
                                if(rows.isValidRow()){
                                        _total_business_client_amount_on_server = parseInt(rows.fieldByName('business_client_number_on_server'),10);
                                        _total_private_client_amount_on_server = parseInt(rows.fieldByName('private_client_number_on_server'),10);
                                }
                                rows.close();
                                
                                //downloaded clients amount                                
                                if(_selected_client_type_code > 0){
                                        if(_search_text != ''){
                                                rows = db.execute('select count(*) as count from my_client where company_id=? and status_code=1 and client_type_code=? and (client_name like \'%'+_search_text+'%\'  or client_abbr like \'%'+_search_text+'%\')',_selected_company_id,_selected_client_type_code);
                                        }else{
                                                rows = db.execute('select count(*) as count from my_client where company_id=? and status_code=1 and client_type_code=?',_selected_company_id,_selected_client_type_code);
                                        }
                                }else{
                                        if(_search_text != ''){
                                                rows = db.execute('select count(*) as count from my_client where company_id=? and status_code=1 and (client_name like \'%'+_search_text+'%\' or client_abbr like \'%'+_search_text+'%\')',_selected_company_id);
                                        }else{
                                                rows = db.execute('select count(*) as count from my_client where company_id=? and status_code=1',_selected_company_id);
                                        }
                                }
                                _downloaded_item_amount = rows.fieldByName('count');
                                rows.close();
                                db.close();
                                if(_downloaded_item_amount == _displaying_item_amount){
                                        _last_row_title_label.text = "Download More Items ...";
                                }else{
                                        _last_row_title_label.text = "Show More Items ...";
                                }                                   
                                if(_search_text != ''){
                                        _total_item_amount_on_server = _downloaded_item_amount;
                                }else{
                                        switch(_selected_client_type_code){
                                                case 0://all
                                                        _total_item_amount_on_server = _total_business_client_amount_on_server+_total_private_client_amount_on_server;
                                                        break;
                                                case 1://business
                                                        _total_item_amount_on_server = _total_business_client_amount_on_server;
                                                        break;
                                                case 2://private
                                                        _total_item_amount_on_server = _total_private_client_amount_on_server;
                                                        break;
                                        }
                                }
                                self.total_my_jobs_on_server.text = _last_row_text_label.text = 'Total '+_total_item_amount_on_server+' client'+((_total_item_amount_on_server>1)?'s':'')+', Downloaded '+_downloaded_item_amount+' client'+((_downloaded_item_amount>1)?'s':'');
                                self.displaying_my_jobs_on_server.text = _last_row_displaying_text_label.text ='Displaying '+_displaying_item_amount+' client'+((_displaying_item_amount>1)?'s':'');                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_last_row_text');
                                return;                                
                        }
                }
                /**
                 * display "download more clients" row
                 */
                function _add_download_more_clients(){
                        try{                     
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'download_more_clients',
                                        className:'download_more_clients',
                                        hasCheck:false,
                                        height:'auto'                                        
                                });                
                
                                var download_more_results = Ti.UI.createLabel({
                                        text:"Download More Clients ...",
                                        width:300,
                                        height:20,
                                        color:"#576c89",
                                        top:5,
                                        bottom:45,                                     
                                        textAlign:"center",
                                        font:{
                                                fontSize:15,
                                                fontWeight:"bold"
                                        }
                                });        
                                _last_row_title_label = download_more_results;
                                row.add(download_more_results);
                                                                                                        
                                var total_my_items_on_server = Ti.UI.createLabel({
                                        text:'Total '+_total_item_amount_on_server+' item'+((_total_item_amount_on_server>1)?'s':'')+', Downloaded '+_downloaded_item_amount+' item'+((_downloaded_item_amount>1)?'s':''),
                                        width:300,
                                        bottom:25,
                                        height:12,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12
                                        }
                                });                 
                                _last_row_text_label = total_my_items_on_server;
                                row.add(total_my_items_on_server);
                                
                                var display_total_my_items_on_server = Ti.UI.createLabel({
                                        text:'Displaying '+_displaying_item_amount+' item'+((_displaying_item_amount>1)?'s':''),
                                        width:300,
                                        bottom:5,
                                        height:12,
                                        color:"#576c89",
                                        textAlign:"center",
                                        font:{
                                                fontSize:12
                                        }
                                });                 
                                _last_row_displaying_text_label = display_total_my_items_on_server;
                                row.add(display_total_my_items_on_server);  
                                self.data.push(row); 
                                return row;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_download_more_clients');
                                return null;
                        }
                }                
        }

        win.addEventListener('focus',function(e){
                try{                        
                        if(client_select_client_page_obj === null){
                                Ti.App.Properties.setBool('select_client_flag',false);
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                client_select_client_page.prototype = new F();
                                client_select_client_page.prototype.constructor = client_select_client_page;
                                client_select_client_page_obj = new client_select_client_page();
                                client_select_client_page_obj.init();
                        }
                        client_select_client_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        client_select_client_page_obj.close_window();
                        client_select_client_page_obj = null;                        
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

