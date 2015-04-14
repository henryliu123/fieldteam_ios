(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_purchase_order_page_obj = null;
        
        function job_base_purchase_order_page(){
                var self = this;
                var window_source = 'job_base_purchase_order_page';
                if(win.action_for_purchase_order == 'edit_purchase_order'){
                        win.title = 'Add Purchase Order';
                }  
                
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
                                _init_rows_for_table_view();
                                self.init_table_view();
                                self.table_view.addEventListener('scroll',function(e){

                                        if(_is_purchase_order_job_address_content_field_focused){
                                                self.purchase_order_job_address_content_field.blur();
                                        }
                                        if(_is_purchase_order_supplier_address_content_field_focused){
                                                self.purchase_order_supplier_address_content_field.blur();
                                        }
                                        if(_is_purchase_order_description_content_field_focused){
                                                self.purchase_order_description_content_field.blur();
                                        }
                                        if(_is_purchase_order_comment_content_field_focused){
                                                self.purchase_order_comment_content_field.blur();
                                        }                                        
                                        if(_is_units_input_field_focused && (_selected_units_input_field_object != null)){
                                                _selected_units_input_field_object.blur();
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }
                };
                /**
                 *  override init_vars function of parent class: fieldteam.js
                 */                    
                self.init_vars = function(){
                        try{
                                var temp_date = new Date();
                                var scheduled_date_year = temp_date.getFullYear();
                                var scheduled_date_month = temp_date.getMonth()+1;
                                var scheduled_date_date = temp_date.getDate();                                
                                _purchase_order_date = _old_purchase_order_date = scheduled_date_year+'-'+(scheduled_date_month<=9?'0'+scheduled_date_month:scheduled_date_month)+'-'+(scheduled_date_date<=9?'0'+scheduled_date_date:scheduled_date_date);
                                                                
                                var db = Titanium.Database.open(self.get_db_name());
                                var client_name = '';
                                var rows = db.execute('SELECT * FROM my_client WHERE id in (select client_id from my_job where id=?)',_selected_job_id);
                                if(rows.isValidRow()){
                                        client_name = rows.fieldByName('client_name');
                                        var client_sub_number = rows.fieldByName('sub_number');
                                        var client_unit_number = rows.fieldByName('unit_number');
                                        if(client_unit_number === null){
                                                client_unit_number = '';
                                        }                                        
                                        var client_street_number = rows.fieldByName('street_number');
                                        client_street_number = (client_street_number === null)?'':client_street_number;
                                        
                                        var client_street_type = rows.fieldByName('street_type');
                                        client_street_type = (client_street_type === null)?'':client_street_type;
                                        

                                        var client_street = rows.fieldByName('street');
                                        client_street = (client_street=== null)?'':self.trim(client_street);
                                        client_street = self.display_correct_street(client_street,client_street_type);      
                                        
                                        var client_suburb = rows.fieldByName('suburb');
                                        client_suburb = (client_suburb === null)?'':client_suburb;

                                        var client_postcode = rows.fieldByName('postcode');
                                        client_postcode = (client_postcode === null)?'':client_postcode;    
                                        
                                        var client_state_id = rows.fieldByName('locality_state_id');
                                        var client_state = '';
                                        if(client_state_id > 0){
                                                var selected_state_obj = db.execute('SELECT * FROM my_locality_state WHERE id=?',client_state_id);
                                                if(selected_state_obj.getRowCount() > 0){
                                                        if(selected_state_obj.isValidRow()){
                                                                client_state = selected_state_obj.fieldByName('state_abbr');
                                                        }
                                                }
                                                selected_state_obj.close();
                                        }   
                                        
                                        var client_address = '';
                                        if(client_street === ''){
                                                client_address = '(Blank)';
                                        }else{
                                                if((client_sub_number === '') || (client_sub_number === null)){
                                                        if((client_unit_number === '') || (client_unit_number === null)){
                                                                client_address = client_street_number+' '+client_street+'\n'+client_suburb+(client_state===''?'':' '+client_state)+(client_postcode === ''?'':' '+client_postcode);
                                                        }else{
                                                                client_address = client_unit_number+'/'+client_street_number+' '+client_street+'\n'+client_suburb+(client_state===''?'':' '+client_state)+(client_postcode === ''?'':' '+client_postcode);
                                                        }
                                                }else{
                                                        if((client_unit_number === '') || (client_unit_number === null)){
                                                                client_address = client_street_number+' '+client_street+'\n'+client_suburb+(client_state===''?'':' '+client_state)+(client_postcode === ''?'':' '+client_postcode);
                                                        }else{
                                                                client_address = client_unit_number+'-'+client_sub_number+'/'+client_street_number+' '+client_street+'\n'+client_suburb+(client_state===''?'':' '+client_state)+(client_postcode === ''?'':' '+client_postcode);
                                                        }
                                                }                                                                                
                                        }        
                                        _client_address = client_name+'\n'+((client_address != '')?client_address.toUpperCase():client_address);
                                }
                                rows.close();
                                
                                //copy job description to purchase_order description
                                rows = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                if(rows.isValidRow()){
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
                                _selected_job_address = _job_address = client_name+'\n'+((address != '')?address.toUpperCase():address);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: fieldteam.js
                 */                      
                self.table_view_click_event = function(e){
                        try{                        
                                _current_selected_row = e.row;
                                switch(_current_selected_row.className){
                                        case 'set_purchase_order_date':
                                                var temp_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'base/select_date.js'),
                                                        content:_purchase_order_date
                                                });
                                                Titanium.UI.currentTab.open(temp_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });                                                
                                                break;
                                        case 'purchase_order_item':
                                                if(_current_selected_row.hasCheck){
                                                        _current_selected_row.hasCheck = false;                                                        
                                                }else{
                                                        _current_selected_row.hasCheck = true;
                                                }        
                                                for(var m=0,n=_purchase_order_item_array.length;m<n;m++){
                                                        if(_purchase_order_item_array[m].id == _current_selected_row.purchase_order_item_id){
                                                                _purchase_order_item_array[m].is_checked = _current_selected_row.hasCheck;
                                                                break;
                                                        }                                                        
                                                }
                                                break;
                                        default:
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
                self.nav_right_btn_click_event = function(e){
                        try{
                                if(_is_purchase_order_job_address_content_field_focused){
                                        self.purchase_order_job_address_content_field.blur();
                                }
                                if(_is_purchase_order_supplier_address_content_field_focused){
                                        self.purchase_order_supplier_address_content_field.blur();
                                }
                                if(_is_purchase_order_description_content_field_focused){
                                        self.purchase_order_description_content_field.blur();
                                }
                                if(_is_purchase_order_comment_content_field_focused){
                                        self.purchase_order_comment_content_field.blur();
                                }                                        
                                if(_is_units_input_field_focused && (_selected_units_input_field_object != null)){
                                        _selected_units_input_field_object.blur();
                                }
                                                                                                                                      
                                if(!Ti.Network.online){
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return;
                                }else{
                                        var error_string = '';
                                        if(_selected_job_address == undefined || _selected_job_address==null || self.trim(_selected_job_address) == ''){
                                                error_string = 'Please enter job address.';
                                        }
                                        if(_supplier_address == undefined || _supplier_address==null || self.trim(_supplier_address) == ''){
                                                if(error_string != ''){
                                                        error_string += '\n';
                                                }
                                                error_string += 'Please enter supplier address.';
                                        }        
                                        if(_purchase_order_date == undefined || _purchase_order_date==null || self.trim(_purchase_order_date) == ''){
                                                if(error_string != ''){
                                                        error_string += '\n';
                                                }
                                                error_string += 'Please select date.';
                                        }                                           
                                        if(error_string != ''){
                                                self.show_message(error_string);
                                                return;
                                        }                                        
                                }
                                
                                //upload data and generate purchase_order ,then client can download pdf file.
                                self.display_indicator('Generating purchase order ...',false);
                                var temp_array = null;                             
                                
                                var purchase_order_item_array =[];                           
                                for(var i=0,j=_purchase_order_item_array.length;i<j;i++){                                                               
                                        var temp_checked = ((_purchase_order_item_array[i].is_checked == undefined) || (_purchase_order_item_array[i].is_checked == null))?0:((_purchase_order_item_array[i].is_checked)?1:0);
                                        if(temp_checked){                                                
                                                temp_array = {                                                        
                                                        'id':((_purchase_order_item_array[i].id == undefined) || (_purchase_order_item_array[i].id == null))?0:_purchase_order_item_array[i].id,
                                                        'local_id':((_purchase_order_item_array[i].local_id == undefined) || (_purchase_order_item_array[i].local_id == null))?0:_purchase_order_item_array[i].local_id,
                                                        'itemName':((_purchase_order_item_array[i].item_name == undefined) || (_purchase_order_item_array[i].item_name == null))?0:_purchase_order_item_array[i].item_name,
                                                        'units': ((_purchase_order_item_array[i].units == undefined) || (_purchase_order_item_array[i].units == null))?('0'):(_purchase_order_item_array[i].units)
                                                };
                                                Ti.API.info(temp_array);
                                                purchase_order_item_array.push(temp_array);
                                        }
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
                                                                return;
                                                        }
                                                        Ti.API.info(this.responseText);
                                                        var result = JSON.parse(this.responseText);                                                        
                                                        if(parseInt(result) <= 0){
                                                                //check result
                                                                self.hide_indicator();
                                                                var alertDialog = Titanium.UI.createAlertDialog({
                                                                        title:L('message_warning'),
                                                                        message:'Save data error. System will update current '+_type+' and you can try it later.',
                                                                        buttonNames:['Close']
                                                                });
                                                                alertDialog.show();                                                                                
                                                                alertDialog.addEventListener('click',function(e){
                                                                        if(Ti.Network.online){
                                                                                self.display_indicator('Updating Current '+_type+' ...',false);
                                                                                _update_current_job();
                                                                        }else{
                                                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                        }                                                                                                                                                                                
                                                                });
                                                                                                                                
                                                        }else{
                                                                self.update_selected_tables(null,'PurchaseOrder',result);   
                                                                self.update_selected_tables(null,'PurchaseOrderItem',result);   
                                                                //remove selected job operation manual record as they have been saved on server and download to local again.
                                                                _removePurchaseOrderItem(JSON.stringify(purchase_order_item_array));                                                                
                                                                self.hide_indicator();   
                                                                win.close(); 
                                                        }
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Create purchase order failed.',
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
                                                        message:'Create purchase order failed.',
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
                                                message:'Create purchase order failed.',
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
                                        'type':'generate_purchase_order',
                                        'hash':_selected_user_id,
                                        'user_id':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'job_id':(_type == 'job')?_selected_job_id:0,
                                        'quote_id':(_type == 'quote')?_selected_job_id:0,
                                        'job_type':_type,
                                        'job_address':_selected_job_address,
                                        'purchase_address':_supplier_address,
                                        'purchaseItems':JSON.stringify(purchase_order_item_array),
                                        'purchase_order_date':_purchase_order_date,
                                        'description':_purchase_order_description,
                                        'purchase_order_comments':_purchase_order_comment,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                  
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
                
                self.display = function(){
                        try{
                                self.data = [];
                                self.table_view.setData([]);
                                _section_no = 0;
                                _init_rows_for_table_view();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                        
                };
                
                /**
                 *  update field value after set properties 
                 *  in focus event call it
                 */
                self.update_field_value_after_set_properites = function(){
                        try{                                                                            
                                if(Ti.App.Properties.getBool('update_select_date_view_flag')){
                                        _purchase_order_date = Ti.App.Properties.getString('update_select_date_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.purchase_order_date = _purchase_order_date;
                                                var temp_str = self.display_date_only(self.get_seconds_value_by_time_string(_purchase_order_date));
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = temp_str; 
                                        }
                                        if(_old_purchase_order_date !=_purchase_order_date){
                                                _is_make_changed = true;
                                                _old_purchase_order_date = _purchase_order_date;
                                        }                                        
                                        Ti.App.Properties.setBool('update_select_date_view_flag',false);
                                }
                                if(Ti.App.Properties.getBool('select_supplier_address_flag')){
                                        _supplier_address = Ti.App.Properties.getString('select_supplier_address_view_content_address');
                                        if(_current_selected_row != null){
                                                _current_selected_row.supplier_address = _supplier_address;
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _supplier_address; 
                                        }
                                        if(_old_supplier_address !=_supplier_address){
                                                _is_make_changed = true;
                                                _old_supplier_address = _supplier_address;
                                        }                                        
                                        Ti.App.Properties.setBool('select_supplier_address_flag',false);
                                }                                   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                  
                
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _type = win.type;
                var _selected_job_id = win.job_id; 
                var _selected_purchase_order_id = win.purchase_order_id;
                var _selected_job_address = '';
                var _job_address = '';
                var _client_address = '';
                var _old_supplier_address = '';
                var _supplier_address = '';
                var _old_purchase_order_date = '';
                var _purchase_order_date = '';
                var _header_view_height = 30;
                var _header_view_title_height = 26;
                var _header_view_font_size = 16;
                var _section_no = 0;
                var _purchase_order_item_array = [];
                var _purchase_order_description = '';
                var _purchase_order_comment = '';
                var _is_purchase_order_job_address_content_field_focused = false;
                var _is_purchase_order_supplier_address_content_field_focused = false;
                var _is_purchase_order_description_content_field_focused = false;
                var _is_purchase_order_comment_content_field_focused = false;
                var _is_units_input_field_focused = false;
                var _selected_units_input_field_object = null;
                var _is_make_changed = false;
                var _current_selected_row = null;
                
                
                //private method
                function _init_rows_for_table_view(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name()); 
                                _init_purchase_order_job_address_section(db);                                
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_purchase_order_supplier_address_section(db);
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_purchase_order_date_section(db);  
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_purchase_order_item_section(db);                    
                                _setup_row_for_purchase_order_item_section();
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_purchase_order_description_section(db);  
                                if(!self.is_ios_7_plus()){
                                        _init_a_separate_line();
                                }
                                _init_purchase_order_comment_section(db);  
                                db.close();   
                                if((self.table_view != undefined) && (self.table_view != null)){
                                        self.table_view.setData(self.data);
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_rows_for_table_view');
                                return;
                        }                          
                }                
                              
                /**
                 *  init header view of row and set events for click button
                 */
                function _init_row_header_view(title,fieldType,fieldPosition){
                        try{
                                if(title != ''){
                                        var header_view = Ti.UI.createView({
                                                height:_header_view_height,
                                                width:self.screen_width
                                        });         
                                        if(self.is_ios_7_plus()){
                                                header_view.backgroundColor = self.set_table_view_header_backgroundcolor;
                                        }                                          
                                        var header_title_label = Ti.UI.createLabel({
                                                font:{
                                                        fontSize:_header_view_font_size,
                                                        fontWeight:'bold'
                                                },
                                                text:title,
                                                textAlign:'left',
                                                top:0,
                                                left:(self.is_ipad())?50:10,
                                                width:self.screen_width,
                                                height:_header_view_title_height,
                                                color:self.section_header_title_font_color,
                                                shadowColor:self.section_header_title_shadow_color,
                                                shadowOffset:self.section_header_title_shadow_offset
                                        });
                                        header_view.add(header_title_label);
                                        
                                        if(fieldType != '' && fieldPosition == 'header'){
                                                var header_value_label = null;
                                                if(fieldType == 'supplier_address'){          
                                                        header_value_label = Ti.UI.createButton({
                                                                font:{
                                                                        fontSize:_header_view_font_size,
                                                                        fontWeight:'bold'
                                                                },                                                                
                                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                                name:'select_supplier_address',
                                                                title:'Suppliers',    
                                                                textAlign:'center',
                                                                top:0,
                                                                right:(self.is_ipad())?50:10,
                                                                width:100,
                                                                height:30                                  
                                                        });
                                                        header_view.add(header_value_label);  
                                                        header_value_label.addEventListener('click',function(){
                                                                var select_supplier_win = Ti.UI.createWindow({
                                                                        url:self.get_file_path('url', 'supplier/select_supplier_address.js'),
                                                                        type:_type,
                                                                        job_id:_selected_job_id
                                                                });
                                                                Titanium.UI.currentTab.open(select_supplier_win,{
                                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                });
                                                        });
                                                }    
                                                if(fieldType == 'purchase_order_item'){          
                                                        header_value_label = Ti.UI.createButton({
                                                                font:{
                                                                        fontSize:_header_view_font_size,
                                                                        fontWeight:'bold'
                                                                },                                                                
                                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                                name:'add_purchase_order_item',
                                                                title:'New Item',    
                                                                textAlign:'center',
                                                                top:0,
                                                                right:(self.is_ipad())?50:10,
                                                                width:100,
                                                                height:30                                  
                                                        });
                                                        header_view.add(header_value_label);  
                                                        header_value_label.addEventListener('click',function(){
                                                                var add_purchase_order_item_win = Ti.UI.createWindow({
                                                                        url:self.get_file_path('url', 'job/base/job_purchase_order_item.js'),
                                                                        action_for_purchase_order_item:'add_purchase_order_item',
                                                                        type:_type,
                                                                        job_id:_selected_job_id,
                                                                        purchase_order_id:_selected_purchase_order_id,
                                                                        purchase_order_item_id:0,
                                                                        purchase_order_item_name:'',
                                                                        purchase_order_item_units:''
                                                                });
                                                                Titanium.UI.currentTab.open(add_purchase_order_item_win,{
                                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                                }); 
                                                        });
                                                }                                                 
                                        }
                                }
                                //footerview
                                if(fieldType != '' && fieldPosition === 'footer'){
                                        var footer_view = Ti.UI.createView({
                                                height:_header_view_height,
                                                width:self.screen_width
                                        });                 
                                        var footer_title_label = Ti.UI.createLabel({
                                                font:{
                                                        fontSize:_header_view_font_size,
                                                        fontWeight:'bold'
                                                },
                                                text:'',
                                                textAlign:'left',
                                                top:0,
                                                left:(self.is_ipad())?50:10,
                                                width:200,
                                                height:_header_view_title_height,
                                                color:self.section_header_title_font_color,
                                                shadowColor:self.section_header_title_shadow_color,
                                                shadowOffset:self.section_header_title_shadow_offset
                                        });
                                        footer_view.add(footer_title_label);
                                        var footer_value_label = null;
                                        if(fieldType == 'job_address'){
                                                footer_title_label.text = 'Use Client Address';                                
                                                footer_value_label = Ti.UI.createSwitch({
                                                        value:0,                                     
                                                        right:(self.is_ipad())?50:10,
                                                        height:_header_view_height+20                                  
                                                });
                                                footer_view.add(footer_value_label); 
                                                footer_value_label.addEventListener('change',function(e){
                                                        if(e.value){
                                                                _selected_job_address = _client_address;                                                               
                                                        }else{
                                                                _selected_job_address = _job_address;
                                                        }
                                                        self.purchase_order_job_address_content_field.value = _selected_job_address;
                                                });                                                
                                        }                                    
                                }                               
                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view,
                                        footerView:footer_view
                                });
                                self.data[_section_no] = section;  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_row_header_view');
                                return;
                        }
                }                                
                
                /**
                 *  init purchase_order job address field
                 */                            
                function _init_purchase_order_job_address_section(db){
                        try{
                                _init_row_header_view('Job Address','job_address','footer');
                                var purchase_order_job_address_field = Ti.UI.createTableViewRow({
                                        className:'set_purchase_order_job_address',
                                        filter_class:'set_purchase_order_job_address',
                                        valueRequired:true,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter job address.',//for check value
                                        height:100
                                });
                                self.purchase_order_job_address_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:90,
                                        textAlign:'left',
                                        left:10,
                                        right:10,
                                        value:_selected_job_address,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.purchase_order_job_address_content_field.borderWidth=1;
                                        self.purchase_order_job_address_content_field.borderColor= '#ccc';
                                        self.purchase_order_job_address_content_field.borderRadius= 5;
                                }                                  
                                purchase_order_job_address_field.add(self.purchase_order_job_address_content_field);                       
                                self.data[_section_no].add(purchase_order_job_address_field);   
                                self.purchase_order_job_address_content_field.addEventListener('change',function(e){
                                        _selected_job_address = e.value;
                                        _is_make_changed = true;
                                });
                                self.purchase_order_job_address_content_field.addEventListener('focus',function(e){
                                        _is_purchase_order_job_address_content_field_focused = true;
                                });   
                                self.purchase_order_job_address_content_field.addEventListener('blur',function(e){
                                        _is_purchase_order_job_address_content_field_focused = false;
                                });                                  
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_job_address_section');
                                return;
                        }                        
                }   
                /**
                 *  init purchase_order supplier address field
                 */                            
                function _init_purchase_order_supplier_address_section(db){
                        try{
                                _init_row_header_view('Supplier Address','supplier_address','header');
                                var purchase_order_supplier_address_field = Ti.UI.createTableViewRow({
                                        className:'set_purchase_order_supplier_address',
                                        filter_class:'set_purchase_order_supplier_address',
                                        valueRequired:true,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter supplier address.',//for check value
                                        height:100
                                });
                                self.purchase_order_supplier_address_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:90,
                                        textAlign:'left',
                                        left:10,
                                        right:10,
                                        value:_supplier_address,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.purchase_order_supplier_address_content_field.borderWidth=1;
                                        self.purchase_order_supplier_address_content_field.borderColor= '#ccc';
                                        self.purchase_order_supplier_address_content_field.borderRadius= 5;
                                }                                      
                                purchase_order_supplier_address_field.add(self.purchase_order_supplier_address_content_field);                       
                                self.data[_section_no].add(purchase_order_supplier_address_field);   
                                self.purchase_order_supplier_address_content_field.addEventListener('change',function(e){
                                        _old_supplier_address = _supplier_address = e.value;
                                        _is_make_changed = true;
                                });
                                self.purchase_order_supplier_address_content_field.addEventListener('focus',function(e){
                                        _is_purchase_order_supplier_address_content_field_focused = true;
                                });   
                                self.purchase_order_supplier_address_content_field.addEventListener('blur',function(e){
                                        _is_purchase_order_supplier_address_content_field_focused = false;
                                });                                  
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_supplier_address_section');
                                return;
                        }                        
                }                   
                
                function _init_purchase_order_date_section(db){
                        try{
                                _init_row_header_view('Date','','');                
                                var purchase_order_date_field = Ti.UI.createTableViewRow({
                                        purchase_order_date:_purchase_order_date,
                                        className:'set_purchase_order_date',
                                        filter_class:'set_purchase_order_date',
                                        valueRequired:true,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please select date.',//for check value
                                        height:50
                                });
                                self.purchase_order_date_content_field = Ti.UI.createLabel({                                        
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:40,
                                        textAlign:'left',
                                        left:10,
                                        right:10,
                                        text:self.display_date_only(self.get_seconds_value_by_time_string(_purchase_order_date)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                purchase_order_date_field.add(self.purchase_order_date_content_field);                       
                                self.data[_section_no].add(purchase_order_date_field);                        
                                _section_no++;  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_date_section');
                                return;
                        }                        
                }                     
                
                function _init_purchase_order_item_section(db){
                        try{
                                var temp_purchase_order_item_array = _purchase_order_item_array;
                                _purchase_order_item_array = [];                              
                                var sql = 'select * from my_purchase_order_item where status_code=1 and purchase_order_id='+_selected_purchase_order_id+' and id>1000000000 order by id desc';    
                                var rows = db.execute(sql);
                                while(rows.isValidRow()){
                                        var temp_var = {
                                                id:rows.fieldByName('id'),
                                                local_id:rows.fieldByName('local_id'),
                                                item_name:rows.fieldByName('item_name'),
                                                units:rows.fieldByName('units'),
                                                is_checked:true                                                
                                        };
                                        if(temp_purchase_order_item_array.length > 0){//check exist data setting, if exist , then check it's has been marked up, checked, total marked up , total discount'
                                                for(var m=0,n=temp_purchase_order_item_array.length;m<n;m++){
                                                        if(temp_purchase_order_item_array[m].id == rows.fieldByName('id')){
                                                                temp_var.is_checked =temp_purchase_order_item_array[m].is_checked; 
                                                                break;
                                                        }
                                                }
                                        }                                                                                                                                       
                                        _purchase_order_item_array.push(temp_var);
                                        rows.next();
                                }         
                                rows.close();                          
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_item_section');
                                return;
                        }                         
                }

                function _setup_row_for_purchase_order_item_section(){
                        try{                      
                                _init_row_header_view('Purchase Order Items','purchase_order_item','header');     
                                for(var i=0,j=_purchase_order_item_array.length;i<j;i++){
                                        var row = Ti.UI.createTableViewRow({
                                                name:'purchase_order_item',
                                                filter_class:'purchase_order_item',
                                                className:'purchase_order_item',
                                                height:55,
                                                hasCheck:_purchase_order_item_array[i].is_checked?true:false,
                                                view_url:'job/edit/job_purchase_order_item.js',
                                                value:false,
                                                purchase_order_item_id:((_purchase_order_item_array[i].id == undefined) || (_purchase_order_item_array[i].id == null))?0:_purchase_order_item_array[i].id,                                                
                                                item_name:((_purchase_order_item_array[i].item_name == undefined) || (_purchase_order_item_array[i].item_name == null))?'':_purchase_order_item_array[i].item_name,
                                                units:((_purchase_order_item_array[i].units == undefined) || (_purchase_order_item_array[i].units == null))?0:_purchase_order_item_array[i].units                                      
                                        });
                
                                        var purchase_order_item_title_field = Ti.UI.createLabel({
                                                top:3,
                                                width:200,
                                                height:20,
                                                textAlign:'left',
                                                left:10,
                                                text:((_purchase_order_item_array[i].item_name == undefined) || (_purchase_order_item_array[i].item_name == null))?'':_purchase_order_item_array[i].item_name,
                                                font:{
                                                        fontSize:self.font_size,
                                                        fontWeight:self.font_weight
                                                }
                                        });   
                                        row.add(purchase_order_item_title_field);      
                                                                        
                                        var item_edit = Ti.UI.createButton({
                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                name:'purchase_item_edit_btn',
                                                bottom:3,
                                                title:'Edit',                                        
                                                left:10,
                                                width:60,
                                                height:25,
                                                font:{
                                                        fontSize:self.small_font_size,
                                                        fontWeight:self.font_weight
                                                },  
                                                section_object:self.data[_section_no],
                                                row_object:row,
                                                value:false
                                        });
                                        row.add(item_edit);       

                                        
                                        var purchase_order_item_unit_title_field = Ti.UI.createLabel({
                                                bottom:3,
                                                right:65,
                                                width:50,
                                                height:25,
                                                textAlign:'center',
                                                text:'Units',
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size,
                                                        fontWeight:self.font_weight
                                                }
                                        });   
                                        row.add(purchase_order_item_unit_title_field);                                         
                                                                                                                
                                        var units_input_field = Ti.UI.createTextField({
                                                name:'purchase_order_item_units',
                                                hintText:'',
                                                bottom:3,
                                                right:23,
                                                width:50,
                                                height:25,
                                                textAlign:'center',
                                                value:((_purchase_order_item_array[i].units == undefined) || (_purchase_order_item_array[i].units == null))?'0.00':(parseFloat(_purchase_order_item_array[i].units)+''),
                                                keyboardType:Titanium.UI.KEYBOARD_DECIMAL_PAD,
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size
                                                },                
                                                section_object:self.data[_section_no],
                                                row_object:row,                                         
                                                backgroundImage:self.get_file_path('image','inputfield.png')
                                        });
                                        row.add(units_input_field);
                                        
                                        item_edit.addEventListener('click',function(e){
                                                var temp_item_name = '';
                                                var temp_item_units = '';
                                                for(var m=0,n=_purchase_order_item_array.length;m<n;m++){
                                                        if(e.source.row_object.purchase_order_item_id == _purchase_order_item_array[m].id){
                                                                temp_item_name = _purchase_order_item_array[m].item_name;
                                                                temp_item_units = _purchase_order_item_array[m].units;
                                                        }
                                                }
                                                var edit_purchase_order_item_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/base/job_purchase_order_item.js'),
                                                        action_for_purchase_order_item:'edit_purchase_order_item',
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        purchase_order_id:_selected_purchase_order_id,
                                                        purchase_order_item_id:e.source.row_object.purchase_order_item_id,
                                                        purchase_order_item_name:temp_item_name,
                                                        purchase_order_item_units:temp_item_units
                                                });
                                                Titanium.UI.currentTab.open(edit_purchase_order_item_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });                                                 
                                        });     
                                        
                                        units_input_field.addEventListener('change',function(e){
                                                if(!self.check_valid_price(e.value)){
                                                        self.show_message('Please enter number greater than zero.');
                                                        this.value = e.source.row_object.units;
                                                        return;                                                
                                                }else{
                                                        e.source.row_object.units = this.value;
                                                        _refresh_purchase_item_units(e.source.row_object.purchase_order_item_id,this.value);
                                                } 
                                        });                                            
                                                                                                                                                
                                        units_input_field.addEventListener('focus',function(e){
                                                _selected_units_input_field_object = e.source;
                                                _is_units_input_field_focused = true;
                                        });                                        
                                                                        
                                        units_input_field.addEventListener('blur',function(e){                                                   
                                                _is_units_input_field_focused = false;
                                                _selected_units_input_field_object = null;
                                                e.source.row_object.units = this.value;
                                                _refresh_purchase_item_units(e.source.row_object.purchase_order_item_id,this.value);
                                        });
                                        self.data[_section_no].add(row);                                        
                                }              
                                _section_no++; 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_purchase_order_item_section');
                                return;
                        }                        
                }
                /**
                         *  init purchase_order description field
                         */                            
                function _init_purchase_order_description_section(db){
                        try{
                                _init_row_header_view('Description','','');
                                var purchase_order_description_field = Ti.UI.createTableViewRow({
                                        className:'set_purchase_order_description',
                                        filter_class:'set_purchase_order_description',
                                        valueRequired:true,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter description.',//for check value
                                        height:100
                                });
                                self.purchase_order_description_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:90,
                                        textAlign:'left',
                                        left:10,
                                        right:10,
                                        value:_purchase_order_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.purchase_order_description_content_field.borderWidth=1;
                                        self.purchase_order_description_content_field.borderColor= '#ccc';
                                        self.purchase_order_description_content_field.borderRadius= 5;
                                }                                    
                                purchase_order_description_field.add(self.purchase_order_description_content_field);                       
                                self.data[_section_no].add(purchase_order_description_field);   
                                self.purchase_order_description_content_field.addEventListener('change',function(e){
                                        _purchase_order_description = e.value;
                                        _is_make_changed = true;
                                });
                                self.purchase_order_description_content_field.addEventListener('focus',function(e){
                                        _is_purchase_order_description_content_field_focused = true;
                                });   
                                self.purchase_order_description_content_field.addEventListener('blur',function(e){
                                        _is_purchase_order_description_content_field_focused = false;
                                });                                  
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_description_section');
                                return;
                        }                        
                }      
                /**
                         *  init purchase_order comment field
                         */                            
                function _init_purchase_order_comment_section(db){
                        try{
                                _init_row_header_view('Comment','','');
                                var purchase_order_comment_field = Ti.UI.createTableViewRow({
                                        className:'set_purchase_order_comment',
                                        filter_class:'set_purchase_order_comment',
                                        valueRequired:true,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter comment.',//for check value
                                        height:100
                                });
                                self.purchase_order_comment_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:90,
                                        textAlign:'left',
                                        left:10,
                                        right:10,
                                        value:_purchase_order_comment,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.purchase_order_comment_content_field.borderWidth=1;
                                        self.purchase_order_comment_content_field.borderColor= '#ccc';
                                        self.purchase_order_comment_content_field.borderRadius= 5;
                                }                                 
                                purchase_order_comment_field.add(self.purchase_order_comment_content_field);                       
                                self.data[_section_no].add(purchase_order_comment_field);   
                                self.purchase_order_comment_content_field.addEventListener('change',function(e){
                                        _purchase_order_comment = e.value;
                                        _is_make_changed = true;
                                });
                                self.purchase_order_comment_content_field.addEventListener('focus',function(e){
                                        _is_purchase_order_comment_content_field_focused = true;
                                });   
                                self.purchase_order_comment_content_field.addEventListener('blur',function(e){
                                        _is_purchase_order_comment_content_field_focused = false;
                                });                                  
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_purchase_order_comment_section');
                                return;
                        }                        
                }                  
                
                function _init_a_separate_line(){
                        try{
                                var header_view = Ti.UI.createView({
                                        left:10,
                                        right:10,
                                        height:2,
                                        width:self.screen_width                
                                });
                                var header_line = Ti.UI.createLabel({
                                        left:(self.is_ipad())?50:10,
                                        right:(self.is_ipad())?50:10,
                                        height:2,
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-20,
                                        backgroundColor:self.section_header_title_font_color
                                });
                                header_view.add(header_line);
                                
                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view
                                });
                                self.data[_section_no] = section;
                                _section_no++;
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_a_separate_line');
                                return;
                        }
                }
                                               
                /**
                         *  check if exist any change
                         */
                function _check_if_exist_change(){
                        try{
                                return _is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }             
        
                function _update_current_job(){
                        try{
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
                                                        self.refresh_job_and_relative_tables(this.responseText,_type);
                                                        self.hide_indicator(); 
                                                        win.close();  
                                                }else{
                                                        self.hide_indicator(); 
                                                        var params = {
                                                                message:'update current job error.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _update_current_job - xhr.onload - 1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                           
                                                        return;
                                                }                                                                
                                        }catch(e){
                                                self.hide_indicator(); 
                                                params = {
                                                        message:'update current job error.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _update_current_job - xhr.onload - 2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);  
                                                return;
                                        }
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator(); 
                                        var params = {
                                                message:'update current job error.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _update_current_job - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);                                          
                                        return;
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'download_job',
                                        'job_type':_type,
                                        'hash':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'user_id':_selected_user_id,
                                        'job_id_string':_selected_job_id,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                
                        }catch(err){
                                self.hide_indicator(); 
                                self.process_simple_error_message(err,window_source+' - _update_current_job');
                                return;                                
                        }
                }          
        
                //remove selected job operation manual
                function _removePurchaseOrderItem(purchaseOrderString){
                        try{
                                var array = JSON.parse(purchaseOrderString);
                                var purchase_order_item_id_array = [];
                                for(var i=0,j=array.length;i<j;i++){
                                        purchase_order_item_id_array.push(array[i].id);
                                }
                                if(purchase_order_item_id_array.length > 0){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        db.execute('delete from my_purchase_order_item where id in ('+purchase_order_item_id_array.join(',')+')');
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _removePurchaseOrderItem');
                                return false; 
                        }                         
                }        
                
                function _refresh_purchase_item_units(purchase_order_item_id,val){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                var row = db.execute('select * from my_purchase_order_item where id=?',purchase_order_item_id);
                                if(row.isValidRow()){
                                        if(row.fieldByName('units') != val){
                                                db.execute('update my_purchase_order_item set units='+(val == ''?0:val)+' where id=?',purchase_order_item_id);
                                        }
                                }
                                row.close();
                                db.close();
                                for(var  m=0,n=_purchase_order_item_array.length;m<n;m++){
                                        if(_purchase_order_item_array[m].id == purchase_order_item_id){
                                                _purchase_order_item_array[m].units = val;
                                        }
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_purchase_item_units');
                                return;         
                        }
                }
        }
        
        win.addEventListener('focus',function(){
                try{
                        if(job_base_purchase_order_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_purchase_order_page.prototype = new F();
                                job_base_purchase_order_page.prototype.constructor = job_base_purchase_order_page;
                                job_base_purchase_order_page_obj = new job_base_purchase_order_page();
                                job_base_purchase_order_page_obj.init();
                        }else{
                                job_base_purchase_order_page_obj.update_field_value_after_set_properites();
                                job_base_purchase_order_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });
        
        win.addEventListener('close',function(){
                try{
                        job_base_purchase_order_page_obj.close_window();
                        job_base_purchase_order_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
