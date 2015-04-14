(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;
        var job_base_material_item_management_page_obj = null;

        function job_base_material_item_management_page(){
                var self = this;
                var window_source = 'job_base_material_item_management_page';
                if(win.action_for_material === 'add_job_material'){
                        win.title = 'Add Material';
                }else{
                        win.title = 'Edit Material';
                }                
                
                //public member 
                self.pull_down_to_update = false;
                self.pull_down_to_download_more = true;                  
                
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
                                self.init_vars();
                                //self.init_controls();
                                _init_search_bar();
                                _init_bottom_bar();
                                _init_library_item(false);
                                _add_download_more_items();
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view(); 
                                self.table_view.top = self.tool_bar_height;
                                self.table_view.bottom = self.tool_bar_height;
                                //call init_no_result_label function of parent class: fieldteam.js
                                self.init_no_result_label();  
                                _update_last_row_text();
                                _display_warning_as_not_set_material_location();
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_selected_table_view_row != null){
                                                _selected_table_view_row.blur();
                                                _selected_table_view_row = null;
                                        }
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
                 * init some variables
                 */                
                self.init_vars = function(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_summary WHERE id=?',_selected_user_id);                                
                                if(_is_item_management){
                                        _total_item_amount_on_server = rows.fieldByName('library_item_number_on_selected_location');
                                }else{
                                        _total_item_amount_on_server = rows.fieldByName('library_item_number_on_server');
                                }
                                rows.close();
                                db.close();                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                        
                };
                /**
                 * init some controls
                 */
                self.init_controls = function(){
                        try{
                                var help_label = Ti.UI.createLabel({
                                        text:'Drag Screen For More Items From The Server ',
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
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.nav_right_btn_click_event = function(e){
                        try{
                                _save_selected_materials_items(e,true);
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
                                if(_check_if_exist_change()){
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
                 *  override table_view_click_event function of parent class: fieldteam.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                var index = e.index;
                                Ti.API.info('index:'+index);
                                var section = e.section;
                                var filter_class = self.data[index].filter_class;
                                switch(filter_class){
                                        case 'set_material_item':
                                                Ti.API.info('section.rows[index].hasCheck:'+section.rows[index].hasCheck);
                                                if(section.rows[index].hasCheck){
                                                        section.rows[index].hasCheck = false;
                                                }else{
                                                        section.rows[index].hasCheck = true;
                                                }
                                                break;
                                        case 'download_more_items':
                                                if(_is_need_to_download){
                                                        self.begin_download_more_jobs_by_scroll_down();
                                                }else{
                                                        _append_more_items();
                                                }
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
                                        var library_item_id_array = [];
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = null;
                                        if(_is_item_management){
                                                rows = db.execute('select b.job_library_item_id from my_materials_stocks as b where b.company_id=? and b.status_code=1 and b.materials_locations_id=?',
                                                        _selected_company_id,_selected_materials_locations_id);
                                        }else{
                                                rows = db.execute('SELECT id as job_library_item_id  FROM my_job_library_item where company_id=? and status_code=1',_selected_company_id);
                                        }                                        
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        library_item_id_array.push(rows.fieldByName('job_library_item_id'));
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
                                                                        self.update_selected_tables(null,'JobLibraryItem',JSON.parse(this.responseText));       
                                                                        if(_is_item_management){
                                                                                self.update_selected_tables(null,'MaterialsStocks',JSON.parse(this.responseText));  
                                                                        }
                                                                        self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));  
                                                                }
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                                _append_more_items();
                                                        }else{
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                                var params = {
                                                                        message:'Download library item failed.',
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
                                                                message:'Download library item failed.',
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
                                                        message:'Download library item failed.',
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
                                                'type':'get_library_item_list_from_server_with_id_array',
                                                'hash':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'search_string':_search_string,
                                                'selected_materials_locations_id':(_is_item_management)?_selected_materials_locations_id:0,
                                                'is_item_management':_is_item_management,
                                                'limit':self.count_for_job_query,
                                                'library_item_id_string':library_item_id_array.join(','),
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
                 * display library item list
                 */ 
                self.display = function(){
                        try{
                                self.data = [];
                                _displaying_item_id_array = [];
                                if(self.trim(_search_string) != ''){
                                        _init_library_item(false);
                                }else{
                                        _init_library_item(true);
                                }
                                _add_download_more_items();   
                                _update_last_row_text();
                                self.table_view.setData(self.data);                                                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }
                };

                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _action_for_material = win.action_for_material;
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_assigned_item_id = win.job_assigned_item_id;
                var _selected_job_library_item_id = win.job_library_item_id;
                var _units = win.units;
                var _search_string = '';
                var _selected_materials_locations_id = ((Ti.App.Properties.getString('selected_materials_locations_id') == undefined) ||(Ti.App.Properties.getString('selected_materials_locations_id') == null))?0:parseInt(Ti.App.Properties.getString('selected_materials_locations_id'));
                var _is_item_management = parseInt(Ti.App.Properties.getString('current_company_active_material_location'));
                var _total_item_amount_on_server = 0;
                var _downloaded_item_amount = 0;
                var _displaying_item_id_array = [];
                var _append_data = [];
                var _displaying_item_amount = 0;
                var _last_row_title_label = null;
                var _last_row_text_label = null;
                var _last_row_displaying_text_label = null;
                var _is_need_to_download = false;
                var _selected_table_view_row = null;
                var _selected_field_object = null;

                //private method                
                /**
                 *  init search tool bar
                 */
                function _init_search_bar(){
                        try{
                                //add a toolbar with search field
                                var flexSpace = Titanium.UI.createButton({
                                        systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
                                });

                                self.searchBar = Ti.UI.createSearchBar({
                                        showCancel:false,
                                        hintText:'Search',
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
                                        _search_string = e.value;
                                        _search_string = self.replace(_search_string,'\"','');//remove " symbol
                                        _search_string = self.replace(_search_string,'\'','');//remove ' symbol'                                           
                                        self.display();
                                });

                                self.searchBar.addEventListener('return',function(e){
                                        self.searchBar.blur();
                                        self.searchBar.showCancel = false;
                                        _search_string = e.value;
                                        _search_string = self.replace(_search_string,'\"','');//remove " symbol
                                        _search_string = self.replace(_search_string,'\'','');//remove ' symbol'                                           
                                        self.begin_download_more_jobs_by_scroll_down();
                                });

                                self.searchBar.addEventListener('blur',function(){
                                        self.searchBar.showCancel = false;
                                        _selected_field_object = null;
                                });

                                self.searchBar.addEventListener('cancel',function(e){
                                        self.searchBar.showCancel = false;
                                        self.searchBar.value = '';
                                        self.searchBar.blur();
                                        _search_string = '';
                                        self.display();
                                });

                                self.searchBar.addEventListener('focus', function(e){
                                        self.searchBar.showCancel = true;
                                        _selected_field_object = e.source;
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
                                self.add_new_materials_btn_bar = Titanium.UI.createButtonBar({
                                        labels:['Create New Item'],
                                        backgroundColor:'#336699'
                                });
                                
                                self.save_item_btn_bar = Titanium.UI.createButtonBar({
                                        labels:['Add Item'],
                                        backgroundColor:'#336699'
                                });

                                var bottomToolBar = Ti.UI.iOS.createToolbar({
                                        items:[self.add_new_materials_btn_bar,flexSpace,self.save_item_btn_bar],
                                        bottom:0,
                                        borderColor:self.tool_bar_color_in_ios_7,
                                        borderWidth:1,
                                        zIndex:100                                        
                                });
                                if(self.is_ios_7_plus()){
                                        bottomToolBar.barColor = self.default_tool_bar_background_color;
                                        self.add_new_materials_btn_bar.backgroundColor = self.set_table_view_header_backgroundcolor;  
                                        self.save_item_btn_bar.backgroundColor = self.set_table_view_header_backgroundcolor;    
                                }                                      
                                win.add(bottomToolBar);
                                
                                self.add_new_materials_btn_bar.addEventListener('click',function(e){
                                        _add_new_material_item_btn_click_event(e);
                                });     
                                
                                self.save_item_btn_bar.addEventListener('click',function(e){
                                        _add_item_btn_click_event(e);
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_bottom_bar');
                                return;
                        }
                }     
                /**
                 *  add new materials item event
                 */
                function _add_new_material_item_btn_click_event(e){
                        try{
                                var btnIndex = e.index;
                                if(btnIndex === 0){
                                        var add_library_item_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','library_item/edit_library_item.js'),
                                                library_item_id:0,
                                                library_item_reference_number:0,
                                                action_for_library_item:'add_library_item'
                                        });
                                        Titanium.UI.currentTab.open(add_library_item_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_new_material_item_btn_click_event');
                                return;
                        }
                } 
                /**
                 *  add selected's materials item to database event
                 */
                function _add_item_btn_click_event(e){
                        try{
                                var btnIndex = e.index;
                                if(btnIndex === 0){
                                        _save_selected_materials_items(e,false);
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_item_btn_click_event');
                                return;
                        }
                }                 
                
                /**
                 * init libary item list
                 */
                function _init_library_item(is_append_item){
                        try{       
                                _append_data = [];
                                _get_downloaded_items_count();
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = null;
                                var sql = '';
                                if(_is_item_management){
                                        sql = 'select a.*,c.amount as stock,(select sum(d.units) from my_job_assigned_item as d where '+
                                        'd.job_library_item_id = c.job_library_item_id and d.materials_locations_id=c.materials_locations_id and d.id>1000000000'+
                                        ') as job_used_stock_amount,(select sum(e.units) from my_quote_assigned_item as e where '+
                                        'e.job_library_item_id = c.job_library_item_id and e.materials_locations_id=c.materials_locations_id and e.id>1000000000'+
                                        ') as quote_used_stock_amount from my_job_library_item as a '+
                                        'inner join my_materials_stocks as c on (c.job_library_item_id= a.id and c.materials_locations_id=? and c.company_id=?) ';       
                                        if(_search_string == ''){
                                                sql +=' where a.status_code=1 and a.company_id=? ';                                                      
                                        }else{
                                                sql +=' where a.status_code=1 and a.company_id=? and a.item_name like \'%'+_search_string+'%\' ';                                                                          
                                        }                                      
                                        if(is_append_item && _displaying_item_id_array.length>0){
                                                sql += ' and a.id not in ('+_displaying_item_id_array.join(',')+')';
                                        }
                                        sql += ' order by a.item_name asc';  
                                        sql += ' limit '+self.count_for_job_query;
                                        rows = db.execute(sql,_selected_materials_locations_id,_selected_company_id,_selected_company_id);   
                                }else{
                                        sql = 'SELECT * FROM my_job_library_item WHERE company_id='+_selected_company_id+' and status_code=1 ';
                                        if(_search_string != ''){
                                                sql +=' and item_name like \'%'+_search_string+'%\' ';                                                                          
                                        }       
                                        if(is_append_item && _displaying_item_id_array.length>0){
                                                sql += ' and id not in ('+_displaying_item_id_array.join(',')+')';
                                        }                                        
                                        sql += ' ORDER BY item_name ASC ';
                                        sql += ' limit '+self.count_for_job_query;
                                        rows = db.execute(sql);   
                                }                                                                                                 
                                var b = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                _displaying_item_id_array.push(rows.fieldByName('id'));
                                                var row = Ti.UI.createTableViewRow({
                                                        filter_class:'set_material_item',
                                                        className:'data_row_'+b,
                                                        library_item_id:rows.fieldByName('id'),
                                                        hasCheck:false,
                                                        height:'auto'
                                                });                                          
                                                if(_is_item_management){
                                                        var title_label = Ti.UI.createLabel({
                                                                left:10,
                                                                width:self.screen_width-120,
                                                                text:rows.fieldByName('item_name'),
                                                                height:'auto',
                                                                top:5,
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label);
                                                        var title_label_line_num = parseInt(title_label.toImage().width/(self.screen_width-120))+((title_label.toImage().width%(self.screen_width-120))>0?1:0);
                                                        title_label_line_num = (title_label_line_num ==0)?1:title_label_line_num;//fix error, title_label_line_num return 0 then it will overlap description content.
                                                        var real_stock_amount = (rows.fieldByName('stock') != null)?rows.fieldByName('stock'):0;
                                                        var job_used_stock_amount = (rows.fieldByName('job_used_stock_amount') != null)?rows.fieldByName('job_used_stock_amount'):0;
                                                        var quote_used_stock_amount = (rows.fieldByName('quote_used_stock_amount') != null)?rows.fieldByName('quote_used_stock_amount'):0;
                                                        real_stock_amount -= job_used_stock_amount;
                                                        real_stock_amount -= quote_used_stock_amount;
                                                        
                                                        var stock_label = Ti.UI.createLabel({
                                                                left:10,
                                                                width:self.screen_width-120,
                                                                text:'(Stock:'+real_stock_amount+')',
                                                                height:'auto',
                                                                top:title_label_line_num*20+5,
                                                                color:(real_stock_amount < 0)?'red':self.selected_value_font_color,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(stock_label);     
                                                        //description
                                                        var description_label = Ti.UI.createLabel({
                                                                left:10,
                                                                width:self.screen_width-120,
                                                                text:rows.fieldByName('description'),
                                                                height:'auto',
                                                                top:(title_label_line_num+1)*20+5,
                                                                bottom:3,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(description_label);                                                           
                                                }else{                                                       
                                                        var title_label2 = Ti.UI.createLabel({
                                                                left:10,
                                                                width:self.screen_width-120,
                                                                text:rows.fieldByName('item_name'),
                                                                height:'auto',
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label2);
                                                        
                                                        if((rows.fieldByName('description') != null) && ((rows.fieldByName('description') != ''))){
                                                                title_label2.top = 5;
                                                                title_label_line_num = parseInt(title_label2.toImage().width/(self.screen_width-120))+((title_label2.toImage().width%(self.screen_width-120))>0?1:0);
                                                                title_label_line_num = (title_label_line_num ==0)?1:title_label_line_num;//fix error, title_label_line_num return 0 then it will overlap description content.
                                                                //description
                                                                description_label = Ti.UI.createLabel({
                                                                        left:10,
                                                                        width:self.screen_width-120,
                                                                        text:rows.fieldByName('description'),
                                                                        height:'auto',
                                                                        top:title_label_line_num*20+5,
                                                                        bottom:3,
                                                                        font:{
                                                                                fontSize:self.small_font_size
                                                                        }
                                                                });
                                                                row.add(description_label);                                                                 
                                                        }else{
                                                                description_label = Ti.UI.createLabel({
                                                                        left:10,
                                                                        width:self.screen_width-120,
                                                                        text:"",
                                                                        height:'auto',
                                                                        font:{
                                                                                fontSize:self.small_font_size
                                                                        }
                                                                });
                                                                row.add(description_label);                                                                      
                                                        }                                                           
                                                }
                                                var unit_label = Ti.UI.createLabel({
                                                        right:50,
                                                        width:50,
                                                        text:'Units',
                                                        height:40,
                                                        font:{
                                                                fontSize:self.normal_font_size
                                                        }
                                                });
                                                row.add(unit_label);      
                                                var unit_text_field = Ti.UI.createTextField({
                                                        backgroundImage:self.get_file_path('image','inputfield.png'),
                                                        right:20,
                                                        width:40,
                                                        value:(rows.fieldByName('id') === _selected_job_library_item_id)?_units:1,
                                                        height:40,
                                                        textAlign:'center',
                                                        font:{
                                                                fontSize:self.normal_font_size
                                                        },
                                                        keyboardType:Titanium.UI.KEYBOARD_NUMBER_PAD
                                                });
                                                unit_text_field.addEventListener('focus',function(e){
                                                        _selected_table_view_row = e.source;
                                                });
                                                row.add(unit_text_field);
                                                self.data.push(row);                                                
                                                if(is_append_item){
                                                        _append_data.push(row);
                                                }
                                                rows.next();
                                                b++;
                                        }
                                }
                                rows.close();
                                db.close();                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item');
                                return;
                        }                        
                }
                /**
                 * update last row's text
                 */
                function _update_last_row_text(){
                        try{
                                _displaying_item_amount = self.data.length-1;
                                if(_downloaded_item_amount == _displaying_item_amount){
                                        _last_row_title_label.text = "Download More Items ...";
                                        _is_need_to_download = true;
                                }else{
                                        _last_row_title_label.text = "Show More Items ...";
                                        _is_need_to_download = false;
                                }
                                if(_search_string != ''){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = null;
                                        var sql = '';
                                        if(_is_item_management){
                                                sql = 'select count(a.id) as search_count from my_job_library_item as a '+
                                                'inner join my_materials_stocks as c on (c.job_library_item_id= a.id and c.materials_locations_id=? and c.company_id=?) ';       
                                                sql +=' where a.status_code=1 and a.company_id=? and a.item_name like \'%'+_search_string+'%\' ';                                                                                                            
                                                sql += ' order by a.item_name asc';  
                                                rows = db.execute(sql,_selected_materials_locations_id,_selected_company_id,_selected_company_id);   
                                        }else{
                                                sql = 'SELECT count(id) as search_count FROM my_job_library_item WHERE company_id='+_selected_company_id+' and status_code=1 ';
                                                sql +=' and item_name like \'%'+_search_string+'%\' ';                                                                                                                       
                                                sql += ' ORDER BY item_name ASC ';
                                                rows = db.execute(sql);
                                        }
                                        var temp_total_item_amount_on_server = 0;
                                        if(rows.isValidRow()){
                                                temp_total_item_amount_on_server = rows.fieldByName('search_count');
                                        }
                                        rows.close();
                                        db.close();                                                                                
                                        self.total_my_jobs_on_server.text = _last_row_text_label.text = 'Total '+temp_total_item_amount_on_server+' item'+((temp_total_item_amount_on_server>1)?'s':'')+', Downloaded '+_downloaded_item_amount+' item'+((_downloaded_item_amount>1)?'s':'');                                        
                                }else{
                                        self.total_my_jobs_on_server.text = _last_row_text_label.text = 'Total '+_total_item_amount_on_server+' item'+((_total_item_amount_on_server>1)?'s':'')+', Downloaded '+_downloaded_item_amount+' item'+((_downloaded_item_amount>1)?'s':'');
                                }                                                             
                                self.displaying_my_jobs_on_server.text = _last_row_displaying_text_label.text ='Displaying '+_displaying_item_amount+' item'+((_displaying_item_amount>1)?'s':'');
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_last_row_text');
                                return;                                
                        }
                }
                /**
                 * get downloaded items's count
                 */
                function _get_downloaded_items_count(){
                        try{       
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = null;
                                var sql = '';
                                if(_is_item_management){
                                        sql = 'select a.*,c.amount as stock,(select sum(d.units) from my_job_assigned_item as d where '+
                                        'd.job_library_item_id = c.job_library_item_id and d.materials_locations_id=c.materials_locations_id and d.id>1000000000'+
                                        ') as job_used_stock_amount,(select sum(e.units) from my_quote_assigned_item as e where '+
                                        'e.job_library_item_id = c.job_library_item_id and e.materials_locations_id=c.materials_locations_id and e.id>1000000000'+
                                        ') as quote_used_stock_amount from my_job_library_item as a '+
                                        'inner join my_materials_stocks as c on (c.job_library_item_id= a.id and c.company_id=? and c.materials_locations_id=?) ';       
                                        if(_search_string == ''){
                                                sql +=' where a.status_code=1 and a.company_id=?';                                                      
                                        }else{
                                                sql +=' where a.status_code=1 and a.company_id=? and a.item_name like \'%'+_search_string+'%\'';                                                                          
                                        }                                  
                                        sql += ' order by a.item_name asc';
                                        rows = db.execute(sql,_selected_company_id,_selected_materials_locations_id,_selected_company_id); 
                                }else{
                                        sql = 'SELECT * FROM my_job_library_item WHERE company_id='+_selected_company_id+' and status_code=1 ';
                                        if(_search_string != ''){
                                                sql +=' and item_name like \'%'+_search_string+'%\' ';                                                                          
                                        }                                          
                                        sql += ' ORDER BY item_name ASC ';
                                        rows = db.execute(sql);                                        
                                }
                                _downloaded_item_amount = rows.getRowCount();                                
                                rows.close();
                                db.close();                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _get_downloaded_items_count');
                                return;
                        }                          
                }
                //append more items for table view
                function _append_more_items(){
                        try{
                                self.table_view.deleteRow(self.data.length-1,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP
                                });
                                self.data.pop();
                                self.init_vars();
                                _init_library_item(true);                                      
                                _append_data.push(_add_download_more_items());
                                _update_last_row_text();
                                self.table_view.appendRow(_append_data,{
                                        animationStyle:Titanium.UI.iPhone.RowAnimationStyle.UP
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _append_more_items');
                                return;
                        }    
                }  
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;
                                for(var i=0,j=self.table_view.data[0].rows.length-1;i<j;i++){
                                        if(self.table_view.data[0].rows[i].hasCheck){                                                        
                                                is_make_changed = true;
                                                break;
                                        }
                                }                                                                         
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }      
                /**
                 * display "download more items" row
                 */
                function _add_download_more_items(){
                        try{                     
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'download_more_items',
                                        className:'download_more_items',
                                        hasCheck:false,
                                        height:'auto'                                        
                                });                
                
                                var download_more_results = Ti.UI.createLabel({
                                        text:"Download More Items ...",
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
                                self.process_simple_error_message(err,window_source+' - _add_download_more_items');
                                return null;
                        }
                }
                function _display_warning_as_not_set_material_location(){
                        try{
                                if(_is_item_management && _selected_materials_locations_id<=0){
                                        var alertDialog = Titanium.UI.createAlertDialog({
                                                title:L('message_warning'),
                                                message:'You haven\'t set your materials location and please call backend administrator to set it for you.',
                                                buttonNames:['Close']
                                        });
                                        alertDialog.show();                                                                                
                                        alertDialog.addEventListener('click',function(e){                                                     
                                                return;                                                                                                                                                                          
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_warning_as_not_set_material_location');
                                return;
                        }
                }     
                /**
                 *  save selected item to database
                 */
                function _save_selected_materials_items(e,is_exit_after_save){
                        try{
                                if(_check_if_exist_change()){
                                        if(self.data.length > 0){
                                                if(_action_for_material == 'add_job_material'){
                                                        var result_array = [];
                                                        for(var i=0,j=self.table_view.data[0].rows.length;i<j;i++){
                                                                if(self.table_view.data[0].rows[i].hasCheck){
                                                                        var temp_var  = {
                                                                                library_item_id:self.table_view.data[0].rows[i].library_item_id,
                                                                                units:(_is_item_management)?self.table_view.data[0].rows[i].children[4].value:self.table_view.data[0].rows[i].children[3].value
                                                                        };
                                                                        result_array.push(temp_var);
                                                                }
                                                        }
                                                        if(result_array.length > 0){
                                                                var db = Titanium.Database.open(self.get_db_name());
                                                                for(i=0,j=result_array.length;i<j;i++){
                                                                        var d = new Date();
                                                                        var new_time_value = parseInt(d.getTime(), 10)+i;
                                                                        db.execute('INSERT INTO my_'+_type+'_assigned_item (id,local_id,'+_type+'_id,job_library_item_id,materials_locations_id,units,item_order,status_code,changed)'+
                                                                                'VALUES(?,?,?,?,?,?,?,?,?)',
                                                                                new_time_value,
                                                                                _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                                                _selected_job_id,
                                                                                result_array[i].library_item_id,
                                                                                _is_item_management?_selected_materials_locations_id:0,
                                                                                result_array[i].units,
                                                                                0,
                                                                                1,
                                                                                1);
                                                                }
                                                                
                                                                db.close();
                                                                if(is_exit_after_save){
                                                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                                                self.close_all_window_and_return_to_menu(); 
                                                                        }else{                                                                
                                                                                win.close();
                                                                        }
                                                                }else{
                                                                        var m= 0;
                                                                        for(i=0,j=self.table_view.data[0].rows.length;i<j;i++){
                                                                                if(self.table_view.data[0].rows[i].hasCheck){
                                                                                        self.table_view.data[0].rows[i].hasCheck = false;
                                                                                        m++;
                                                                                }
                                                                        } 
                                                                        if(m>0){
                                                                                self.show_message(m+' item'+((m>1)?'s':'')+' '+(m>1?'have':'has')+' been added.');
                                                                                return;
                                                                        }else{
                                                                                self.show_message('Please select item.');  
                                                                                return;
                                                                        }
                                                                }
                                                        }else{
                                                                self.show_message('Please select item.');
                                                                return;
                                                        }
                                                }else{
                                                        db = Titanium.Database.open(self.get_db_name());
                                                        for(i=0,j=self.table_view.data[0].rows.length;i<j;i++){
                                                                if(self.table_view.data[0].rows[i].hasCheck){                                                        
                                                                        db.execute('UPDATE my_'+_type+'_assigned_item set job_library_item_id=?,units=?,changed=1 WHERE id=?',self.table_view.data[0].rows[i].library_item_id,self.table_view.data[0].rows[i].children[2].value,_selected_job_assigned_item_id);                                                        
                                                                        break;
                                                                }
                                                        }
                                                        db.close();
                                                        if(is_exit_after_save){
                                                                if(e.index == self.default_main_menu_button_index){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }
                                                        }else{
                                                                m = 0;
                                                                for(i=0,j=self.table_view.data[0].rows.length;i<j;i++){
                                                                        if(self.table_view.data[0].rows[i].hasCheck){
                                                                                self.table_view.data[0].rows[i].hasCheck = false;
                                                                                m++;
                                                                        }
                                                                }            
                                                                if(m>0){
                                                                        self.show_message(m+' item'+((m>1)?'s':'')+' '+(m>1?'have':'has')+' been added.');
                                                                        return;
                                                                }else{
                                                                        self.show_message('Please select item.');   
                                                                        return;
                                                                }
                                                        }
                                                }
                                        }else{
                                                self.show_message('Please select item.');
                                                return;                                                
                                        }
                                }else{
                                        self.show_message('Please select item.');
                                        return;    
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save_selected_materials_items');
                                return;
                        }
                }                   
        }

        win.addEventListener('open',function(e){
                try{
                        if(job_base_material_item_management_page_obj === null){
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                job_base_material_item_management_page.prototype = new F();
                                job_base_material_item_management_page.prototype.constructor = job_base_material_item_management_page;
                                job_base_material_item_management_page_obj = new job_base_material_item_management_page();
                                job_base_material_item_management_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(e){
                try{
                        job_base_material_item_management_page_obj.close_window();
                        job_base_material_item_management_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });

}());

