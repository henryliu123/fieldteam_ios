/**
 *  Function List:
 *  1. Display Supplier List
 *  2. More Supplier Button for display more suppliers
 *  3. Download More Supplier button for downloading more suppliers from server
 *  4. Add Supplier Button
 *  5. Click any supplier and enter supplier edit page
 *  6. Search bar
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'transaction.js');
        var win = Titanium.UI.currentWindow;    
        var supplier_select_supplier_page_obj = null;

        function supplier_select_supplier_page(){
                var self = this;
                var window_source = 'supplier_select_supplier_page';
                win.title = 'Select Supplier';
                
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
                                self.init_controls();
                                _init_search_bar();       
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();                                
                                self.table_view.top = self.tool_bar_height;
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
                                        text:'Drag Screen For More Suppliers From The Server ',
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
                                if(_selected_supplier_id <= 0){
                                        self.show_message(L('message_select_supplier_in_select_supplier'));
                                        return;
                                }
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_suppliers WHERE id =?',_selected_supplier_id);
                                if(rows.isValidRow()){
                                        _supplier_name = rows.fieldByName('supplier_name');
                                        var state = '';
                                        var state_rows = db.execute('SELECT * FROM my_locality_state WHERE id=?',rows.fieldByName('locality_state_id'));
                                        if((state_rows.getRowCount() > 0) && (state_rows.isValidRow())){
                                                state = state_rows.fieldByName('state_abbr');
                                        }
                                        state_rows.close();
                                        state = (state === null)?'':state;
                                        var suburb = rows.fieldByName('suburb');
                                        suburb = (suburb === null)?'':suburb;
                                
                                        var postcode = rows.fieldByName('postcode');
                                        postcode = (postcode === null)?'':postcode;                                
                                
                                        var sub_number = rows.fieldByName('sub_number');
                                        var unit = rows.fieldByName('unit_number');
                                        if(unit === null){
                                                unit = '';
                                        }
                                        var street_no = rows.fieldByName('street_number');
                                        street_no = (street_no === null)?'':street_no;
                                        var street_type = rows.fieldByName('street_type');
                                        street_type = (street_type === null)?'':street_type;
                                        var street = rows.fieldByName('street');
                                        street = (street=== null)?'':self.trim(street);
                                        street = self.display_correct_street(street,street_type);
                                        var address = '';
                                        if(street === ''){
                                                address = '(Blank)';
                                        }else{
                                                if((sub_number === '') || (sub_number === null)){
                                                        if((unit === '') || (unit === null)){
                                                                address = street_no+' '+street+'\n'+suburb+(state===''?'':' '+state)+(postcode === ''?'':' '+postcode);
                                                        }else{
                                                                address = unit+'/'+street_no+' '+street+'\n'+suburb+(state===''?'':' '+state)+(postcode === ''?'':' '+postcode);
                                                        }
                                                }else{
                                                        if((unit === '') || (unit === null)){
                                                                address = street_no+' '+street+'\n'+suburb+(state===''?'':' '+state)+(postcode === ''?'':' '+postcode);
                                                        }else{
                                                                address = unit+'-'+sub_number+'/'+street_no+' '+street+'\n'+suburb+(state===''?'':' '+state)+(postcode === ''?'':' '+postcode);
                                                        }
                                                }                                                                                
                                        }
                                }
                                rows.close();                                 
                                db.close();       
                                _supplier_address = _supplier_name+'\n'+((address != '')?address.toUpperCase():address);  
                                Ti.App.Properties.setBool('select_supplier_address_flag',true); 
                                Ti.App.Properties.setString('select_supplier_address_view_content_address',_supplier_address);                                                             
                                win.close();                           
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.nav_right_btn_click_event');
                                return;
                        }                        
                };                 
                /**
                         *  override table_view_click_event function of parent class: transaction.js
                         */                  
                self.table_view_click_event = function(e){
                        try{                                      
                                var row  = e.row;  
                                var filter_class = row.filter_class;
                                switch(filter_class){
                                        case 'supplier_class':
                                                if(row != _selected_row){
                                                        row.hasCheck = true;     
                                                        if(_selected_row != null){
                                                                _selected_row.hasCheck = false;
                                                        }
                                                        _selected_row = row;
                                                        _selected_supplier_id = row.supplier_id;
                                                }else{
                                                        if(_selected_row.hasCheck){
                                                                _selected_row.hasCheck = false;
                                                                _selected_supplier_id = 0;
                                                        }else{
                                                                _selected_row.hasCheck = true;
                                                                _selected_supplier_id = row.supplier_id;
                                                        }
                                                }
                                                break;
                                        case 'download_more_suppliers':
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
                                
                                self.total_my_suppliers_on_server = Ti.UI.createLabel({
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
                                
                                self.displaying_my_suppliers_on_server = Ti.UI.createLabel({
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
                                table_view_header.add(self.total_my_suppliers_on_server);
                                table_view_header.add(self.displaying_my_suppliers_on_server);
                                table_view_header.add(pull_view_last_updated);
                                return table_view_header;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_pull_down_view');
                                return null;
                        }
                };                
                /**
                         *  override begin_download_more_jobs_by_scroll_down function of parent class: transaction.js
                         *  but in fact , just download more supplier
                         */    
                self.begin_download_more_jobs_by_scroll_down = function(){
                        try{                
                                if(Ti.Network.online){
                                        self.display_indicator('Loading Data ...');
                                        var supplier_id_array = [];
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT id FROM my_suppliers where company_id=? and status_code=1',_selected_company_id);
                                        if(rows.getRowCount() > 0){
                                                while(rows.isValidRow()){
                                                        supplier_id_array.push(rows.fieldByName('id'));
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
                                                                        self.update_selected_tables(null,'Suppliers',JSON.parse(this.responseText));        
                                                                        self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));    
                                                                }
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                        }else{
                                                                self.end_download_more_jobs_by_scroll_down(true);
                                                                var params = {
                                                                        message:'Download supplier failed.',
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
                                                                message:'Download supplier failed.',
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
                                                        message:'Download supplier failed.',
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
                                                'type':'get_supplier_list_from_server_with_id_array',
                                                'hash':_selected_user_id,
                                                'user_id':_selected_user_id,
                                                'company_id':_selected_company_id,
                                                'search_string':_search_text,
                                                'limit':self.count_for_job_query,
                                                'supplier_id_string':supplier_id_array.join(','),
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
                         * display supplier list . Show letter index if supplier count great than 10
                         */
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                _get_supplier_list();                        
                                _add_download_more_suppliers();   
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
                var _selected_supplier_id=0;
                var _supplier_name = '';
                var _supplier_address = '';
                var _type = win.job_type;
                var _search_text = '';
                var _header_view_button_width = 60;   
                var _total_item_amount_on_server = 0;
                var _downloaded_item_amount = 0;
                var _displaying_item_amount = 0;
                var _last_row_title_label = null;
                var _last_row_text_label = null;
                var _last_row_displaying_text_label = null;
                var _selected_row = null;
                var _selected_field_object = null;
                var _total_supplier_amount_on_server = 0;

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
                                        hintText:'Search Supplier',
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
                         *  add supplier event
                         */
                function _add_btn_click_event(e){
                        try{
                                var btnIndex = e.index;
                                if(btnIndex === 0){
                                        var add_supplier_win = Ti.UI.createWindow({
                                                url:self.get_file_path('url','supplier/edit_supplier.js'),
                                                supplier_id:0,
                                                supplier_reference_number:0,
                                                action_for_supplier:'add_supplier'
                                        });
                                        Titanium.UI.currentTab.open(add_supplier_win,{
                                                animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                        });
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _add_btn_click_event');
                                return;
                        }
                }
                /** 
                         *  get supplier list
                         */
                function _get_supplier_list(){
                        try{
                                var sql = 'SELECT * FROM my_suppliers WHERE company_id='+_selected_company_id+' and status_code=1';                                
                                var db = Titanium.Database.open(self.get_db_name());
                                var search_string = _search_text;
                                var rows = null;
                                if((search_string === '')||(search_string === null)||(search_string === undefined)){                                      
                                        sql +=' ORDER BY supplier_name ASC ';
                                        rows = db.execute(sql);                                        
                                }else{                                    
                                        sql += ' and ((supplier_name like \'%'+search_string+'%\') or (supplier_abbr like \'%'+search_string+'%\'))';
                                        sql +=' ORDER BY supplier_name ASC ';                                
                                        rows = db.execute(sql);
                                }       
                                var n = 0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var row = Ti.UI.createTableViewRow({
                                                        className:'supplier_class_'+n,
                                                        filter_class:'supplier_class',
                                                        supplier_id:rows.fieldByName('id'),
                                                        supplier_reference_number:rows.fieldByName('reference_number'),
                                                        hasCheck:((rows.fieldByName('id') == _selected_supplier_id)?true:false)
                                                });
                                                if((rows.fieldByName('id') == _selected_supplier_id)){
                                                        _selected_row = row;
                                                }                                          
                                                if(self.trim(rows.fieldByName('supplier_abbr')) != ''){
                                                        var title_label = Ti.UI.createLabel({
                                                                top:5,
                                                                left:10,
                                                                width:self.screen_width-100,
                                                                text:rows.fieldByName('supplier_name'),
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.normal_font_size,
                                                                        fontWeight:self.font_weight
                                                                }
                                                        });
                                                        row.add(title_label);
                                                        var abbr_label = Ti.UI.createLabel({
                                                                bottom:3,
                                                                left:10,
                                                                width:self.screen_width-100,
                                                                text:'['+rows.fieldByName('supplier_abbr')+']',
                                                                height:20,
                                                                font:{
                                                                        fontSize:self.small_font_size
                                                                }
                                                        });
                                                        row.add(abbr_label);
                                                }else{
                                                        title_label = Ti.UI.createLabel({
                                                                left:10,
                                                                width:self.screen_width-100,
                                                                text:rows.fieldByName('supplier_name'),
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
                                self.process_simple_error_message(err,window_source+' - _get_supplier_list');
                                return;
                        }                       
                }
                                            
                /**
                 * refresh total_business_supplier_amount,total_private_supplier_amount,downlaoded_supplier_amount,displaying_supplier_amount;
                 */
                function _update_last_row_text(){
                        try{                                
                                _displaying_item_amount = self.data.length-1;
                             
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('select * from my_summary where id=?',_selected_user_id);
                                if(rows.isValidRow()){
                                        _total_supplier_amount_on_server = parseInt(rows.fieldByName('suppliers_number_on_server'),10);
                                }
                                rows.close();
                                
                                //downloaded suppliers amount                                

                                if(_search_text != ''){
                                        rows = db.execute('select count(*) as count from my_suppliers where company_id=? and status_code=1 and (supplier_name like \'%'+_search_text+'%\' or supplier_abbr like \'%'+_search_text+'%\')',_selected_company_id);
                                }else{
                                        rows = db.execute('select count(*) as count from my_suppliers where company_id=? and status_code=1',_selected_company_id);
                                }
                               
                                _downloaded_item_amount = rows.fieldByName('count');
                                rows.close();
                                db.close();
                                if(_downloaded_item_amount == _displaying_item_amount){
                                        _last_row_title_label.text = "Download More Items ...";
                                }else{
                                        _last_row_title_label.text = "Show More Items ...";
                                }                                   
                                self.total_my_suppliers_on_server.text = _last_row_text_label.text = 'Total '+_total_supplier_amount_on_server+' supplier'+((_total_supplier_amount_on_server>1)?'s':'')+', Downloaded '+_downloaded_item_amount+' supplier'+((_downloaded_item_amount>1)?'s':'');
                                self.displaying_my_suppliers_on_server.text = _last_row_displaying_text_label.text ='Displaying '+_displaying_item_amount+' supplier'+((_displaying_item_amount>1)?'s':'');                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_last_row_text');
                                return;                                
                        }
                }
                /**
                 * display "download more suppliers" row
                 */
                function _add_download_more_suppliers(){
                        try{                     
                                var row = Ti.UI.createTableViewRow({
                                        filter_class:'download_more_suppliers',
                                        className:'download_more_suppliers',
                                        hasCheck:false,
                                        height:'auto'                                        
                                });                
                
                                var download_more_results = Ti.UI.createLabel({
                                        text:"Download More Suppliers ...",
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
                                self.process_simple_error_message(err,window_source+' - _add_download_more_suppliers');
                                return null;
                        }
                }                
        }

        win.addEventListener('focus',function(e){
                try{                        
                        if(supplier_select_supplier_page_obj === null){
                                Ti.App.Properties.setBool('select_supplier_address_flag',false);
                                var F = function(){};
                                F.prototype = transaction_page.prototype;
                                supplier_select_supplier_page.prototype = new F();
                                supplier_select_supplier_page.prototype.constructor = supplier_select_supplier_page;
                                supplier_select_supplier_page_obj = new supplier_select_supplier_page();
                                supplier_select_supplier_page_obj.init();
                        }
                        supplier_select_supplier_page_obj.display();
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        supplier_select_supplier_page_obj.close_window();
                        supplier_select_supplier_page_obj = null;                        
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());

