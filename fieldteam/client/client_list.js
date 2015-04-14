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
        var client_list_page_obj = null;
        function client_list_page(){
                var self = this;
                var window_source = 'client_list_page';
                win.title = 'Clients';
                
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
                                self.init_navigation_bar('Add','Main,Back');
                                //self.init_controls();
                                _init_search_bar();
                                if(_can_view_business_client){
                                        _init_bottom_bar();      
                                }
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.top = self.tool_bar_height;
                                if(_can_view_business_client){
                                        self.table_view.bottom = self.tool_bar_height;
                                }
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
                 * init some controls
                 */
                self.init_controls = function(){
                        try{
                                var help_label = Ti.UI.createLabel({
                                        text:'Drag Screen For More Clients From The Server ',
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
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                   
                self.nav_right_btn_click_event = function(e){
                        try{
                                var add_client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','client/edit_client.js'),
                                        client_id:0,
                                        client_reference_number:0,
                                        client_type_code:_client_type_code,
                                        action_for_client:'add_client'
                                });
                                Titanium.UI.currentTab.open(add_client_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                            
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }
                };               
                /**
                 *  override table_view_client_event function of parent class: transaction.js
                 */                   
                self.table_view_click_event = function(e){
                        try{
                                var row  = e.row;  
                                var filter_class = row.filter_class;
                                switch(filter_class){
                                        case 'client_class':
                                                var edit_client_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'client/edit_client.js'),
                                                        client_id:e.row.client_id,
                                                        client_reference_number:e.row.client_reference_number,
                                                        client_type_code:_client_type_code,
                                                        action_for_client:'edit_client',
                                                        parent_win:win,
                                                        is_close_parent_win:false
                                                });
                                                Titanium.UI.currentTab.open(edit_client_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });
                                                break;
                                        case 'download_more_clients':
                                                self.begin_download_more_jobs_by_scroll_down();
                                                break;
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
                                                                        message:'Download client list failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:'',
                                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down -xhr.onload -1',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);
                                                                return;                                                                
                                                        }                                                      
                                                }catch(e){
                                                        self.end_download_more_jobs_by_scroll_down(true);
                                                        params = {
                                                                message:'Download client list failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:e,
                                                                error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down -xhr.onload -2',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);
                                                        return;                                                        
                                                }
                                        };
                                        xhr.onerror = function(e){
                                                self.end_download_more_jobs_by_scroll_down(true);
                                                var params = {
                                                        message:'Download client list failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.begin_download_more_jobs_by_scroll_down -xhr.onerror',
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
                 * display client list
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
                var _client_type_code = win.type;
                var _search_text = '';       
               
                var _header_view_button_width = 60;
                var _header_view_button_height = 26;
                var _header_view_font_size = 16;                  
               
                
                
                var _total_item_amount_on_server = 0;
                var _total_business_client_amount_on_server = 0;
                var _total_private_client_amount_on_server = 0;
                var _downloaded_item_amount = 0;
                var _displaying_item_amount = 0;
                var _last_row_title_label = null;
                var _last_row_text_label = null;
                var _last_row_displaying_text_label = null;
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
                                        height:30,
                                        index:0                                       
                                });                                
                                
                                var bottomToolBar = Ti.UI.iOS.createToolbar({
                                        items:[flexSpace,self.client_type_btn_bar,flexSpace],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100                                        
                                });
                                if(self.is_ios_7_plus()){
                                        bottomToolBar.barColor = self.default_tool_bar_background_color;
                                        self.client_type_btn_bar.backgroundColor = self.set_table_view_header_backgroundcolor;  
                                }                                      
                                win.add(bottomToolBar);        
                                
                                self.client_type_btn_bar.addEventListener('click',function(e){
                                        _client_type_click_event(e);
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_bar');
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
                                        Ti.API.info(sql);
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
                                        Ti.API.info(sql);
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
                                                        hasCheck:false
                                                });
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
                        if(client_list_page_obj === null){
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                client_list_page.prototype = new F();
                                client_list_page.prototype.constructor = client_list_page;
                                client_list_page_obj = new client_list_page();
                                client_list_page_obj.init();
                        }
                        client_list_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });


        win.addEventListener('close',function(e){
                try{
                        client_list_page_obj.close_window();
                        client_list_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

