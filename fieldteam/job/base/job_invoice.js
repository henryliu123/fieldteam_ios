(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_invoice_page_obj = null;
        
        function job_base_invoice_page(){
                var self = this;
                var window_source = 'job_base_invoice_page';
                if(win.action_for_invoice == 'edit_job_invoice'){
                        win.title = 'Edit '+(win.type =='job'?'Invoice':'Quote');
                }else{
                        win.title = 'Add '+(win.type =='job'?'Invoice':'Quote');
                }  
                
                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                      
                self.init = function(){
                        try{
                                self.init_auto_release_pool(win);
                                self.data = [];
                                _is_win_setup = true;
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back'); 
                                self.init_vars();     
                                _init_rows_for_table_view();
                                self.init_table_view();
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_invoice_type == 'auto'){  
                                                if(_is_invoice_description_content_field_focused){
                                                        self.invoice_description_content_field.blur();
                                                }
                                                if(_is_invoice_total_markup_content_field_focused){
                                                        self.invoice_total_markup_content_field.blur();
                                                }
                                                if(_is_invoice_discount_content_field_focused){
                                                        self.invoice_discount_content_field.blur();
                                                }
                                                if(_is_units_input_field_focused && (_selected_units_input_field_object != null)){
                                                        _selected_units_input_field_object.blur();
                                                }
                                        }else{
                                                if(_is_invoice_description_content_field_focused){
                                                        self.invoice_description_content_field.blur();
                                                }                                                
                                                if(_is_invoice_final_price_content_field_focused){
                                                        self.invoice_final_price_content_field.blur();
                                                }
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
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_client WHERE id=?',_selected_client_id);
                                if(rows.isValidRow()){
                                        _client_markup = parseFloat(rows.fieldByName('account_mark_up'));
                                }
                                rows.close();
                                
                                //check company include gst or not
                                rows = db.execute('SELECT * FROM my_company WHERE id=?',_selected_company_id);
                                if(rows.isValidRow()){
                                        _company_gst_exempt = rows.fieldByName('is_gst_exempt');
                                        _tax_name = rows.fieldByName('tax');
                                        _tax_amount = rows.fieldByName('tax_amount');
                                        if(self.trim(_tax_name) == ''){
                                                _tax_name = self.gst_default_name;
                                        }                                        
                                }
                                rows.close(); 
                                //copy job description to invoice description
                                rows = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                if(rows.isValidRow()){
                                        _invoice_description = rows.fieldByName('description');
                                }
                                rows.close();                                 
                                db.close();                                
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
                                var section = null;
                                var row = null;
                                var filter_class = null;   
                                switch(e.source.name){
                                        case 'material_item_btn':
                                                section = e.source.section_object;
                                                row = e.source.row_object;                                           
                                                for(var i=0,j=_material_item_array.length;i<j;i++){
                                                        Ti.API.info("_material_item_array[i].assigned_item_id:"+_material_item_array[i].assigned_item_id);
                                                        Ti.API.info("assigned_item_id:"+row.assigned_item_id);
                                                        if(_material_item_array[i].assigned_item_id == row.assigned_item_id){    
                                                                if(_material_item_array[i].is_markup){
                                                                        e.source.title = 'No';                                                                      
                                                                }else{
                                                                        e.source.title = 'Yes';                                                                    
                                                                }
                                                                _material_item_array[i].is_markup =_material_item_array[i].is_markup?false:true; 
                                                                var temp_material_item_price = 0;
                                                                if(_material_item_array[i].is_markup){
                                                                        temp_material_item_price = _material_item_array[i].markup_amount;   
                                                                }else{
                                                                        temp_material_item_price = _material_item_array[i].amount;
                                                                }                                                               
                                                                if(_markup > 0){//total markup
                                                                        temp_material_item_price = parseFloat(self.currency_formatted(temp_material_item_price*(1+_markup/100)));
                                                                }
                                                                if(_discount > 0){
                                                                        temp_material_item_price = parseFloat(self.currency_formatted(temp_material_item_price*(1-_discount/100)));
                                                                }
                                                                var material_old_price = _material_item_array[i].display_price; 
                                                                _material_item_array[i].display_price = temp_material_item_price;
                                                                row.children[3].text = _selected_currency+self.currency_formatted(temp_material_item_price);         
                                                                
                                                                if(_material_item_array[i].is_checked){
                                                                        _material_item_total_price = _material_item_total_price- material_old_price +temp_material_item_price;   
                                                                }                                                            
                                                                break;
                                                        }
                                                }         
                                                _refresh_total_price(e.source.name,0,section,row); 
                                                break;
                                        case 'labour_item_btn':
                                                section = e.source.section_object;
                                                row = e.source.row_object;                                            
                                                for(i=0,j=_labour_item_array.length;i<j;i++){
                                                        if(_labour_item_array[i].stopped_id == row.stopped_id){
                                                                if(_labour_item_array[i].is_markup){
                                                                        e.source.title = 'No';                                                              
                                                                }else{
                                                                        e.source.title = 'Yes';                                                                    
                                                                }                                                                
                                                                _labour_item_array[i].is_markup = _labour_item_array[i].is_markup?false:true; 
                                                                var temp_labour_item_price = 0;
                                                                if(_labour_item_array[i].is_markup){
                                                                        temp_labour_item_price = _labour_item_array[i].markup_amount;   
                                                                }else{
                                                                        temp_labour_item_price = _labour_item_array[i].amount;
                                                                }                                                               
                                                                if(_markup > 0){//total markup
                                                                        temp_labour_item_price = parseFloat(self.currency_formatted(temp_labour_item_price*(1+_markup/100)));
                                                                }
                                                                if(_discount > 0){
                                                                        temp_labour_item_price = parseFloat(self.currency_formatted(temp_labour_item_price*(1-_discount/100)));
                                                                }
                                                                var labour_old_price = _labour_item_array[i].display_price; 
                                                                _labour_item_array[i].display_price = temp_labour_item_price;
                                                                row.children[3].text = _selected_currency+self.currency_formatted(temp_labour_item_price);         
                                                                
                                                                if(_labour_item_array[i].is_checked){
                                                                        _labour_item_total_price = _labour_item_total_price- labour_old_price +temp_labour_item_price;   
                                                                }                                                            
                                                                break;
                                                        }
                                                }                                                                                                    
                                                _refresh_total_price(e.source.name,0,section,row);                                                    
                                                break;
                                        case 'labour_manual_item_btn':
                                                section = e.section;
                                                row = e.row;                                                
                                                var temp_duration = 0;
                                                for(i=0,j=_labour_manual_item_array.length;i<j;i++){
                                                        if(_labour_manual_item_array[i].id == row.operation_manual_id){                                                                
                                                                temp_duration = parseFloat(_labour_manual_item_array[i].duration);                                                                                                                       
                                                                break;
                                                        }
                                                }     
                                                var edit_operation_manual_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/base/job_invoice_add_labour_manual.js'),
                                                        action_for_job_invoice_labour_manual:'edit_job_invoice_labour_manual',
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        job_operation_manual_id:e.row.operation_manual_id,
                                                        duration:temp_duration,
                                                        company_gst_exempt:_company_gst_exempt
                                                });
                                                Titanium.UI.currentTab.open(edit_operation_manual_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });                                                   
                                                break;
                                        case 'labour_manual_add_item':
                                                var add_operation_manual_win = Ti.UI.createWindow({
                                                        url:self.get_file_path('url', 'job/base/job_invoice_add_labour_manual.js'),
                                                        action_for_job_invoice_labour_manual:'add_job_invoice_labour_manual',
                                                        type:_type,
                                                        job_id:_selected_job_id,
                                                        job_operation_manual_id:0,
                                                        duration:0,
                                                        company_gst_exempt:_company_gst_exempt
                                                });
                                                Titanium.UI.currentTab.open(add_operation_manual_win,{
                                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                                });                                                
                                                break;
                                        case 'material_item':
                                                section = e.section;
                                                row = e.row;
                                                filter_class = e.row.filter_class;     
                                                if(row.hasCheck){
                                                        row.hasCheck = false;                                                        
                                                }else{
                                                        row.hasCheck = true;
                                                }                                                      
                                                for(i=0,j=_material_item_array.length;i<j;i++){
                                                        if(_material_item_array[i].assigned_item_id == row.assigned_item_id){                                                                
                                                                _material_item_array[i].is_checked = (row.hasCheck)?true:false;
                                                                if(_material_item_array[i].is_checked){
                                                                        _material_item_total_price = _material_item_total_price+ parseFloat(_material_item_array[i].display_price);   
                                                                }else{
                                                                        _material_item_total_price = _material_item_total_price-parseFloat(_material_item_array[i].display_price);   
                                                                }                                                           
                                                                break;
                                                        }
                                                }         
                                                _refresh_total_price(e.row.filter_class,0,section,row); 
                                                break;    
                                        case 'labour_item':
                                                section = e.section;
                                                row = e.row;
                                                filter_class = e.row.filter_class;     
                                                if(row.hasCheck){
                                                        row.hasCheck = false;                                                        
                                                }else{
                                                        row.hasCheck = true;
                                                }                                                      
                                                for(i=0,j=_labour_item_array.length;i<j;i++){
                                                        if(_labour_item_array[i].stopped_id == row.stopped_id){                                                                
                                                                _labour_item_array[i].is_checked = (row.hasCheck)?true:false;
                                                                if(_labour_item_array[i].is_checked){
                                                                        _labour_item_total_price = _labour_item_total_price+ parseFloat(_labour_item_array[i].display_price);   
                                                                }else{
                                                                        _labour_item_total_price = _labour_item_total_price-parseFloat(_labour_item_array[i].display_price); 
                                                                }                                                           
                                                                break;
                                                        }
                                                }         
                                                _refresh_total_price(e.row.filter_class,0,section,row); 
                                                break; 
                                        case 'labour_manual_item':
                                                section = e.section;
                                                row = e.row;
                                                filter_class = e.row.filter_class;     
                                                if(row.hasCheck){
                                                        row.hasCheck = false;                                                        
                                                }else{
                                                        row.hasCheck = true;
                                                }                                                      
                                                for(i=0,j=_labour_manual_item_array.length;i<j;i++){
                                                        if(_labour_manual_item_array[i].id == row.operation_manual_id){                                                                
                                                                _labour_manual_item_array[i].is_checked = (row.hasCheck)?true:false;
                                                                if(_labour_manual_item_array[i].is_checked){
                                                                        _labour_item_total_price = _labour_item_total_price+ parseFloat(_labour_manual_item_array[i].display_price);   
                                                                }else{
                                                                        _labour_item_total_price = _labour_item_total_price-parseFloat(_labour_manual_item_array[i].display_price); 
                                                                }                                                           
                                                                break;
                                                        }
                                                }         
                                                _refresh_total_price(e.row.filter_class,0,section,row); 
                                                break;                                                    
                                        default:
                                                section = e.section;
                                                row = e.row;
                                                filter_class = e.row.filter_class;     
                                                _refresh_total_price(filter_class,0,section,row);                                           
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
                                self.display_indicator('Generating '+(_type == 'job'?'Invoice':'Quote')+' ...',false);
                                if(_invoice_type == 'auto'){  
                                        if(_is_invoice_description_content_field_focused){
                                                self.invoice_description_content_field.blur();
                                        }
                                        if(_is_invoice_total_markup_content_field_focused){
                                                self.invoice_total_markup_content_field.blur();
                                        }
                                        if(_is_invoice_discount_content_field_focused){
                                                self.invoice_discount_content_field.blur();
                                        }
                                        if(_is_units_input_field_focused && (_selected_units_input_field_object != null)){
                                                _selected_units_input_field_object.blur();
                                        }
                                }else{
                                        if(_is_invoice_description_content_field_focused){
                                                self.invoice_description_content_field.blur();
                                        }                                                
                                        if(_is_invoice_final_price_content_field_focused){
                                                self.invoice_final_price_content_field.blur();
                                        }
                                }     
                                
                                setTimeout(function(){
                                        Ti.API.info('disocount2:'+_discount);
                                        self.submit_invoice();
                                },3000);  
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
                                _final_price = 0;
                                _total_price = 0;
                                _init_rows_for_table_view();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.display');
                                return;
                        }                        
                };
                
                self.submit_invoice = function(){
                        try{
                                
                                if(_invoice_type == 'auto'){                                         
                                        //check total markup
                                        _markup = self.invoice_total_markup_content_field.value;    
                                        if(isNaN(_markup)){
                                                self.hide_indicator();
                                                self.show_message('Total Markup: please enter number between 0 ~100.');
                                                return;                                                  
                                        }
                                        if((_markup > 100) || (_markup <0)){
                                                self.hide_indicator();
                                                self.show_message('Total Markup: please enter number between 0 ~100.');
                                                return;
                                        }      
                                        //check discount
                                        _discount = self.invoice_discount_content_field.value;
                                        if(isNaN(_discount)){
                                                self.hide_indicator();
                                                self.show_message('Discount: please enter number between 0 ~100.');
                                                return;                                                  
                                        }
                                        if((_discount > 100) || (_discount <0)){
                                                self.hide_indicator();
                                                self.show_message('Discount: please enter number between 0 ~100.');
                                                return;
                                        }    
                                }else{
                                        _final_price = self.invoice_final_price_content_field.value;
                                }
                                var temp_final_price  = _final_price = self.replace(_final_price,_selected_currency,'');
                                _final_price = self.currency_formatted(_final_price);
                                
                                
                                //check final price
                                if(isNaN(parseFloat(temp_final_price))){
                                        self.hide_indicator();
                                        self.show_message('Final Price: Wrong currency format.\n (e.g '+_selected_currency+'123.45)');
                                        return;                                          
                                }else{
                                        if(!self.check_valid_price(_final_price)){
                                                self.hide_indicator();
                                                self.show_message('Final Price: Wrong currency format.\n (e.g '+_selected_currency+'123.45)');
                                                return;                                                
                                        }                                         
                                } 
                                
                                if(!Ti.Network.online){
                                        self.hide_indicator();
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return;
                                }
                                
                                //upload data and generate invoice ,then client can download pdf file.
                                
                                var rows = null,temp_array = null;
                                var if_register_gst_of_company = 0;
                                var db = Titanium.Database.open(self.get_db_name());
                                var row = db.execute('select * from my_company where id=?',_selected_company_id);
                                if(row.isValidRow()){
                                        if_register_gst_of_company = row.fieldByName('is_gst_exempt');
                                }
                                db.close();                                
                                //setup material array
                                var material_array =[];
                                if(_material_section_num > 0){
                                        for(var i=0,j=_material_item_array.length;i<j;i++){       
                                                var temp_markup = ((_material_item_array[i].is_markup == undefined) || (_material_item_array[i].is_markup == null))?0:((_material_item_array[i].is_markup)?1:0);
                                                var temp_checked = ((_material_item_array[i].is_checked == undefined) || (_material_item_array[i].is_checked == null))?0:((_material_item_array[i].is_checked)?1:0);
                                                if(temp_checked){                                                                                                                                                                       
                                                        temp_array = {
                                                                'job_invoice_id':0,
                                                                'job_library_item_id':((_material_item_array[i].library_item_id == undefined) || (_material_item_array[i].library_item_id == null))?0:_material_item_array[i].library_item_id,
                                                                'job_assigned_item_id': ((_material_item_array[i].assigned_item_id == undefined) || (_material_item_array[i].assigned_item_id == null))?0:_material_item_array[i].assigned_item_id,
                                                                'library_item_name':((_material_item_array[i].item_name == undefined) || (_material_item_array[i].item_name == null))?'':_material_item_array[i].item_name,
                                                                'inc_gst':((_material_item_array[i].inc_gst == undefined) || (_material_item_array[i].inc_gst == null))?0:_material_item_array[i].inc_gst,
                                                                'is_gst_exempt':((_material_item_array[i].is_gst_exempt == undefined) || (_material_item_array[i].is_gst_exempt == null))?0:_material_item_array[i].is_gst_exempt,
                                                                'price':((_material_item_array[i].price == undefined) || (_material_item_array[i].price == null))?('0.00'):self.currency_formatted(_material_item_array[i].price),
                                                                'units':((_material_item_array[i].units == undefined) || (_material_item_array[i].units == null))?('0.00'):self.currency_formatted(_material_item_array[i].units),
                                                                'mark_up':temp_markup,
                                                                'item_price':(self.currency_formatted(_material_item_array[i].display_price)),
                                                                'check':temp_checked
                                                        };
                                                        material_array.push(temp_array);
                                                }
                                        }
                                }
                                        
                                
                                
                                var labour_array =[];
                                if(_type === 'job'){                                
                                        if(_labour_section_num > 0){
                                                for(i=0,j=_labour_item_array.length;i<j;i++){       
                                                        temp_markup = ((_labour_item_array[i].is_markup == undefined) || (_labour_item_array[i].is_markup == null))?0:((_labour_item_array[i].is_markup)?1:0);
                                                        temp_checked = ((_labour_item_array[i].is_checked == undefined) || (_labour_item_array[i].is_checked == null))?0:((_labour_item_array[i].is_checked)?1:0);
                                                        if(temp_checked){
                                                                temp_array = {
                                                                        'job_invoice_id':0,
                                                                        'operation_id':((_labour_item_array[i].started_id == undefined) || (_labour_item_array[i].started_id == null))?0:_labour_item_array[i].started_id,
                                                                        'job_operation_stopped_log_id': ((_labour_item_array[i].stopped_id == undefined) || (_labour_item_array[i].stopped_id == null))?0:_labour_item_array[i].stopped_id,
                                                                        'duration':((_labour_item_array[i].duration == undefined) || (_labour_item_array[i].duration == null))?('0.00'):(self.currency_formatted(_labour_item_array[i].duration)),
                                                                        'display_name':((_labour_item_array[i].name == undefined) || (_labour_item_array[i].name == null))?'':_labour_item_array[i].name,
                                                                        'rate_per_hour':((_labour_item_array[i].init_rate == undefined) || (_labour_item_array[i].init_rate == null))?('0.00'):(self.currency_formatted(_labour_item_array[i].init_rate)),                                                                        
                                                                        'manager_user_id':((_labour_item_array[i].id == undefined) || (_labour_item_array[i].id == null))?0:_labour_item_array[i].id,
                                                                        'mark_up':temp_markup,
                                                                        'if_register': if_register_gst_of_company,
                                                                        'item_price':(self.currency_formatted(_labour_item_array[i].display_price)),
                                                                        'check':temp_checked
                                                                };
                                                                labour_array.push(temp_array);
                                                        }
                                                }                                                
                                        }
                                }
                                
                                var labour_manual_item_array =[];
                                if(_type === 'job'){                                
                                        if(_labour_section_num > 0){
                                                for(i=0,j=_labour_manual_item_array.length;i<j;i++){                                                               
                                                        temp_checked = ((_labour_manual_item_array[i].is_checked == undefined) || (_labour_manual_item_array[i].is_checked == null))?0:((_labour_manual_item_array[i].is_checked)?1:0);
                                                        if(temp_checked){
                                                                var temp_date = ((_labour_manual_item_array[i].date == undefined) || (_labour_manual_item_array[i].date == null))?'':_labour_manual_item_array[i].date;                                                               
                                                                temp_array = {
                                                                        'operation_manual_id':((_labour_manual_item_array[i].id == undefined) || (_labour_manual_item_array[i].id == null))?0:_labour_manual_item_array[i].id,
                                                                        'operation_duration': ((_labour_manual_item_array[i].duration == undefined) || (_labour_manual_item_array[i].duration == null))?('0.00'):(self.currency_formatted(_labour_manual_item_array[i].duration)),
                                                                        'operation_time':temp_date,
                                                                        'operation_user':((_labour_manual_item_array[i].name == undefined) || (_labour_manual_item_array[i].name == null))?'':_labour_manual_item_array[i].name,
                                                                        'operation_rate':((_labour_manual_item_array[i].rate == undefined) || (_labour_manual_item_array[i].rate == null))?('0.00'):(self.currency_formatted(_labour_manual_item_array[i].rate)),                                                                        
                                                                        'operation_price':(self.currency_formatted(_labour_manual_item_array[i].display_price)),
                                                                        'if_register': if_register_gst_of_company,
                                                                        'check':temp_checked
                                                                };
                                                                labour_manual_item_array.push(temp_array);
                                                        }
                                                }                                                   
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
                                                        if(result.error != undefined || result.error != null){
                                                                //check result
                                                                self.hide_indicator();
                                                                switch(parseInt(result.error.type)){
                                                                        case 1://success                                                    
                                                                                win.close();                                                                      
                                                                                break;
                                                                        default:
                                                                                //failure to create invoice, need to redownload this job information.
                                                                                var alertDialog = Titanium.UI.createAlertDialog({
                                                                                        title:L('message_warning'),
                                                                                        message:'Sync data error. System will update current '+_type+' and you can try it later.',
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
                                                                }                                                                
                                                        }else{
                                                                if(_type == 'job'){
                                                                        self.update_selected_tables(null,'JobOperationManual',result);   
                                                                        self.update_selected_tables(null,'JobInvoice',result);   
                                                                        self.update_selected_tables(null,'JobInvoiceItem',result);   
                                                                        self.update_selected_tables(null,'JobInvoiceOperationItem',result);   
                                                                        self.update_selected_tables(null,'JobAssignOperationManual',result);
                                                                        //remove selected job operation manual record as they have been saved on server and download to local again.
                                                                        _remove_selected_job_operation_manual(JSON.stringify(labour_manual_item_array));
                                                                }else{
                                                                        self.update_selected_tables(null,'QuoteInvoice',result);  
                                                                } 
                                                                self.hide_indicator();   
                                                                win.close();
                                                        }
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Create '+(_type=='job'?'invoice':'quote')+' failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - self.submit_invoice - xhr.onload - 1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                        
                                                        return;
                                                }
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Create '+(_type=='job'?'invoice':'quote')+' failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - self.submit_invoice - xhr.onload - 2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);   
                                                return;
                                        }
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator();
                                        var params = {
                                                message:'Create '+(_type=='job'?'invoice':'quote')+' failed.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - self.submit_invoice - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);  
                                        return;
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'generate_invoice',
                                        'hash':_selected_user_id,
                                        'manualinvoice':(_invoice_type == 'auto')?0:1,
                                        'user_id':_selected_user_id,
                                        'company_id':_selected_company_id,
                                        'job_id':_selected_job_id,
                                        'quote_id':_selected_job_id,
                                        'job_type':_type,
                                        'client_id':_selected_client_id,
                                        'client_markup':_client_markup,
                                        'total_markup':_markup,
                                        'discount':_discount,
                                        'finnal_price':self.currency_formatted(_final_price)+'',
                                        'total_amount':self.currency_formatted(_total_price)+'',
                                        'hidematerial':(_hide_material_items)?1:0,
                                        'hidelabour':(_hide_labour_items)?1:0,
                                        'showdescription':(_show_material_description)?1:0,
                                        'payment_terms':_invoice_description,  
                                        'materials':JSON.stringify(material_array),
                                        'operations':JSON.stringify(labour_array),
                                        'fields':JSON.stringify(labour_manual_item_array),
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.submit_invoice');
                                return;
                        }    
                };
                
                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _type = win.type;
                var _invoice_type = win.invoice_type;
                var _selected_job_id = win.job_id; 
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_job_invoice_id = win.job_invoice_id;
                var _selected_client_id = win.client_id;
                var _header_view_height = 30;
                var _header_view_title_height = 26;
                var _header_view_font_size = 16;
                var _section_no = 0;
                var _material_item_array = [];
                var _material_item_temp_id_array = [];
                var _material_item_total_price = 0;
                var _labour_item_array = [];
                var _labour_item_temp_id_array = [];
                var _labour_item_total_price  = 0;
                var _labour_manual_item_total_price = 0;
                var _labour_manual_item_array = [];
                var _labour_manual_temp_id_array = [];
                var _invoice_description = '';
                var _total_price = 0;
                var _client_markup = 0;
                var _markup = 0;
                var _discount = 0;
                var _final_price = 0;
                var _hide_material_items = false;
                var _show_material_description = false;
                var _hide_labour_items = false;
                var _material_section_num = 0;
                var _labour_section_num = 0;
                var _company_gst_exempt = 0;
                var _tax_name = '';
                var _tax_amount = 0;
                var _is_invoice_description_content_field_focused = false;
                var _is_invoice_total_markup_content_field_focused = false;
                var _is_invoice_discount_content_field_focused = false;
                var _is_invoice_final_price_content_field_focused = false;
                var _is_units_input_field_focused = false;
                var _selected_units_input_field_object = null;
                var _is_make_changed = false;
                var _is_win_setup = false;//check window is setup or not
                var _temp_item_array = [];//tempture array 
                var _selected_currency = self.get_selected_currency();
                
                
                //private method
                function _init_rows_for_table_view(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name()); 
                                _init_invoice_description_section(db);
                                _init_a_separate_line();
                                if(_invoice_type == 'auto'){                                        
                                        _init_material_item_section(db);
                                        _init_a_separate_line();             
                                        if(_type == 'job'){                                                
                                                _init_labour_item_section(db);                                                
                                                _init_a_separate_line();
                                        }
                                        _init_invoice_sum_total_section();
                                }else{
                                        _init_invoice_sum_total_section_for_manual();
                                }
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
                function _init_row_header_view_and_footer_view(header_title,footer_title,header_value,footer_value){
                        try{
                                var header_view = Ti.UI.createView({
                                        height:_header_view_height,
                                        width:self.screen_width
                                });                                
                                var header_title_label = Ti.UI.createLabel({
                                        font:{
                                                fontSize:_header_view_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:header_title,
                                        textAlign:'left',
                                        top:0,
                                        left:(self.is_ipad())?50:10,
                                        width:100,
                                        height:_header_view_title_height,
                                        color:self.section_header_title_font_color,
                                        shadowColor:self.section_header_title_shadow_color,
                                        shadowOffset:self.section_header_title_shadow_offset
                                });
                                header_view.add(header_title_label);
                                
                                var header_value_label = Ti.UI.createLabel({
                                        font:{
                                                fontSize:_header_view_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:'Sub Total: '+_selected_currency+header_value,
                                        textAlign:'right',
                                        top:3,                                                
                                        right:(self.is_ipad())?50:10,
                                        width:200,
                                        height:_header_view_title_height,
                                        color:self.section_header_title_font_color,
                                        shadowColor:self.section_header_title_shadow_color,
                                        shadowOffset:self.section_header_title_shadow_offset                                           
                                });
                                header_view.add(header_value_label);    
                                
                                
                                //footerview
                                var footer_view = Ti.UI.createView({
                                        height:(header_title == 'Materials')?_header_view_height*2:_header_view_height,
                                        width:self.screen_width
                                });                                
                                var footer_title_label = Ti.UI.createLabel({
                                        font:{
                                                fontSize:_header_view_font_size,
                                                fontWeight:'bold'
                                        },
                                        text:footer_title,
                                        textAlign:'left',
                                        top:3,
                                        left:(self.is_ipad())?50:10,
                                        width:200,
                                        height:_header_view_title_height,
                                        color:self.section_header_title_font_color,
                                        shadowColor:self.section_header_title_shadow_color,
                                        shadowOffset:self.section_header_title_shadow_offset
                                });
                                footer_view.add(footer_title_label);
                                
                                var footer_value_label = Ti.UI.createSwitch({
                                        top:0,
                                        value:footer_value,                                        
                                        right:(self.is_ipad())?50:10,
                                        height:_header_view_height+20                                  
                                });
                                footer_view.add(footer_value_label);   
                                footer_value_label.addEventListener('change',function(e){
                                        switch(header_title){
                                                case 'Materials':
                                                        _hide_material_items = e.value;
                                                        break;
                                                case 'Labour':
                                                        _hide_labour_items = e.value;
                                                        break;
                                        }
                                });
                                
                                if(header_title == 'Materials'){
                                        var show_material_description_label = Ti.UI.createLabel({
                                                font:{
                                                        fontSize:_header_view_font_size,
                                                        fontWeight:'bold'
                                                },
                                                text:'Show Material Description?',
                                                textAlign:'left',
                                                top:_header_view_title_height+5,
                                                left:(self.is_ipad())?50:10,
                                                width:200,
                                                height:_header_view_title_height,
                                                color:self.section_header_title_font_color,
                                                shadowColor:self.section_header_title_shadow_color,
                                                shadowOffset:self.section_header_title_shadow_offset
                                        });
                                        footer_view.add(show_material_description_label);
                                
                                        var show_material_description_switch_label = Ti.UI.createSwitch({
                                                top:_header_view_title_height+5,
                                                value:_show_material_description,                                        
                                                right:(self.is_ipad())?50:10,
                                                height:_header_view_height+20                                  
                                        });
                                        footer_view.add(show_material_description_switch_label);   
                                        show_material_description_switch_label.addEventListener('change',function(e){
                                                _show_material_description = e.value;
                                        });                                        
                                }
                                
                                var section = Ti.UI.createTableViewSection({
                                        headerView:header_view,
                                        footerView:footer_view
                                });
                                self.data[_section_no] = section;  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_row_header_view_and_footer_view');
                                return;
                        }
                }                 
                /**
                 *  init header view of row and set events for click button
                 */
                function _init_row_header_view(title,display_client_markup){
                        try{
                                if(title != ''){
                                        var header_view = Ti.UI.createView({
                                                height:_header_view_height,
                                                width:self.screen_width
                                        });                                
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
                                }
                                //footerview
                                var footer_view = Ti.UI.createView({
                                        height:_header_view_height,
                                        width:self.screen_width
                                }); 
                                if(display_client_markup){
                                        var footer_title_label = Ti.UI.createLabel({
                                                font:{
                                                        fontSize:self.small_font_size
                                                },
                                                text:'The client\'s markup rate:'+self.currency_formatted(_client_markup)+'%',
                                                textAlign:'left',
                                                left:(self.is_ipad())?50:10,
                                                width:200,
                                                height:_header_view_title_height,
                                                color:self.selected_value_font_color
                                        });
                                        footer_view.add(footer_title_label);  
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
                 *  init invoice material item section
                 *  if company register gst, then all items should figure in gst if this item has registered gst.
                 *  if company not register gst, then all items doesn't care gst evenif this item has registered gst.
                 */
                function _init_material_item_section(db){
                        try{    
                                
                                if(_is_win_setup){
                                        _temp_item_array = _material_item_array;
                                }
                                _material_item_array = [];
                                _material_item_temp_id_array = [];
                                _material_item_total_price = 0;                                
                                var sql = '';
                                if(_type == 'job'){
                                        sql = 'SELECT a.*,b.id as library_item_id,b.item_name,b.price,b.inc_gst,b.is_gst_exempt FROM my_'+_type+'_assigned_item as a '+
                                        'left join my_job_library_item b on (a.'+_type+'_library_item_id=b.id) '+
                                        'WHERE a.id>0 and a.id < 1000000000 and a.'+_type+'_id='+_selected_job_id+' and a.status_code=1 and a.id not in ('+
                                        ' select '+_type+'_assigned_item_id from my_'+_type+'_invoice_item where '+_type+'_invoice_id in('+
                                        ' select '+_type+'_invoice_id from my_'+_type+'_invoice where '+_type+'_id='+_selected_job_id+') order by item_order asc) order by item_name asc';
                                }else{
                                        sql = 'SELECT a.*,b.id as library_item_id,b.item_name,b.price,b.inc_gst,b.is_gst_exempt FROM my_'+_type+'_assigned_item as a '+
                                        'left join my_job_library_item b on (a.job_library_item_id=b.id) '+
                                        'WHERE a.id>0 and a.id < 1000000000 and a.'+_type+'_id='+_selected_job_id+' and a.status_code=1 order by item_name asc';                                        
                                }
                                var rows = db.execute(sql);
                                while(rows.isValidRow()){
                                        var price_inc_gst = rows.fieldByName('price');
                                        if(_company_gst_exempt){//company no gst                                                
                                        }else{
                                                if(!rows.fieldByName('inc_gst')){
                                                        if(_tax_amount > 0){
                                                                price_inc_gst = parseFloat(self.currency_formatted(rows.fieldByName('price')*(1+_tax_amount/100)));
                                                        }else{
                                                                price_inc_gst = parseFloat(self.currency_formatted(rows.fieldByName('price')));
                                                        }
                                                }
                                        }                                                                           
                                        if(_material_item_temp_id_array.indexOf(rows.fieldByName('id')) === -1){
                                                var temp_material_item_price = parseFloat(self.currency_formatted(price_inc_gst*rows.fieldByName('units')));
                                                var temp_var = {
                                                        assigned_item_id:rows.fieldByName('id'),
                                                        library_item_id:rows.fieldByName('library_item_id'),
                                                        item_name:rows.fieldByName('item_name'),
                                                        price:price_inc_gst,
                                                        units:rows.fieldByName('units'),
                                                        inc_gst:(_company_gst_exempt)?0:rows.fieldByName('inc_gst'),
                                                        is_gst_exempt:(_company_gst_exempt)?1:rows.fieldByName('is_gst_exempt'),
                                                        amount:temp_material_item_price,
                                                        markup_amount:parseFloat(self.currency_formatted((parseFloat(1+_client_markup/100))*temp_material_item_price)),
                                                        display_price:0,
                                                        is_markup:false,
                                                        is_checked:true
                                                };                                                   
                                                if(_temp_item_array.length > 0){//check exist data setting, if exist , then check it's has been marked up, checked, total marked up , total discount'
                                                        for(var i=0,j=_temp_item_array.length;i<j;i++){
                                                                if(_temp_item_array[i].assigned_item_id == rows.fieldByName('id')){
                                                                        temp_var.is_markup =_temp_item_array[i].is_markup;
                                                                        temp_var.is_checked =_temp_item_array[i].is_checked;                                                                      
                                                                        break;
                                                                }
                                                        }
                                                }                                            
                                                temp_material_item_price = 0;
                                                if(temp_var.is_markup){
                                                        temp_material_item_price = temp_var.markup_amount;   
                                                }else{
                                                        temp_material_item_price = temp_var.amount;
                                                }
                                                if(_markup > 0){
                                                        temp_material_item_price = parseFloat(self.currency_formatted(temp_material_item_price*(1+_markup/100)));
                                                }
                                                if(_discount > 0){
                                                        temp_material_item_price = parseFloat(self.currency_formatted(temp_material_item_price*(1-_discount/100)));
                                                }
                                                if(temp_var.is_checked){
                                                        _material_item_total_price += temp_material_item_price;   
                                                }
                                                temp_var.display_price = self.currency_formatted(temp_material_item_price);
                                                _material_item_array.push(temp_var);
                                                _material_item_temp_id_array.push(rows.fieldByName('id'));                                                    
                                        }                                         
                                        rows.next();
                                }
                                rows.close();
                                _final_price = _total_price += _material_item_total_price;
                                
                                Ti.API.info("_labour_item_total_price1:"+_material_item_total_price);
                                Ti.API.info("_final_price1:"+_final_price);
                                _init_row_header_view_and_footer_view('Materials','Hide Material Items?',self.currency_formatted(_material_item_total_price),_hide_material_items);
                                _setup_row_for_invoice_material_section();           
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_material_item_section');
                                return;
                        }                        
                }
                /**
                 *  init invoice operation labour log field
                 *  all labour rate is not include gst.
                 */
                function _init_labour_item_section(db){
                        try{     
                                if(_is_win_setup){
                                        _temp_item_array = _labour_item_array;
                                }
                                _labour_item_total_price = 0;
                                _labour_item_temp_id_array = [];
                                _labour_item_array = [];
                                var manager_user_array = [];
                                var user_temp_var = {};
                                //var user_rows = db.execute('SELECT * FROM my_manager_user WHERE company_id=?',_selected_company_id);
                                var user_rows = db.execute('SELECT distinct(b.id),b.display_name,b.rate_per_hour from my_manager_user as b where b.id in ('
                                        + 'select a.manager_user_id from my_' + _type + '_operation_log as a where a.' + _type + '_id=' + _selected_job_id + ' and '
                                        + 'a.status_code=1)');
                                while(user_rows.isValidRow()){
                                        user_temp_var = {
                                                id:user_rows.fieldByName('id'),                                                        
                                                display_name:user_rows.fieldByName('display_name'),
                                                rate_per_hour:user_rows.fieldByName('rate_per_hour')
                                        };
                                        manager_user_array.push(user_temp_var);
                                        user_rows.next();
                                }
                                user_rows.close();
                                if(manager_user_array.length > 0){
                                        for(var i=0,j=manager_user_array.length;i<j;i++){
                                                var temp_manager_user_id = manager_user_array[i].id;                                                
                                                var sql = 'select max(started_id) as started_id,stopped_id,started_logged,stopped_logged,duration from (select * from ('+
                                                'select a.id as started_id,b.id as stopped_id,a.logged as started_logged,b.logged as stopped_logged,strftime(\'%s\',b.logged) as x, strftime(\'%s\',a.logged) as y,(strftime(\'%s\',b.logged)-strftime(\'%s\',a.logged)) AS duration from my_'+_type+'_operation_log as a '+
                                                'left join my_'+_type+'_operation_log b on (b.'+_type+'_operation_log_type_code=1 and b.'+_type+'_id=a.'+_type+'_id and b.manager_user_id=a.manager_user_id and b.status_code=1 and (strftime(\'%s\',a.logged)< strftime(\'%s\',b.logged)) and a.id < b.id) '+
                                                'where a.'+_type+'_operation_log_type_code=0 and a.'+_type+'_id='+_selected_job_id+' and a.manager_user_id='+temp_manager_user_id+' and a.status_code=1 '+
                                                'order by a.id asc,b.id asc) as c '+
                                                'where c.started_id > 0 and c.stopped_id not in (select d.'+_type+'_operation_stopped_log_id from my_'+_type+'_invoice_operation_item as d where d.'+_type+'_invoice_id in ('+
                                                'select e.id from my_'+_type+'_invoice as e where e.'+_type+'_id='+_selected_job_id+')) '+
                                                'order by c.started_id asc) group by stopped_id';         
                                                var rows = db.execute(sql);                                                                     
                                                while(rows.isValidRow()){                                                     
                                                        var rate_inc_gst = parseFloat(manager_user_array[i].rate_per_hour);  
                                                        var init_rate = rate_inc_gst;
                                                        if(_company_gst_exempt){//company no gst                                                
                                                        }else{
                                                                if(_tax_amount > 0){
                                                                        rate_inc_gst = parseFloat(self.currency_formatted(rate_inc_gst*(1+_tax_amount/100)));
                                                                }else{
                                                                        rate_inc_gst = parseFloat(self.currency_formatted(rate_inc_gst));
                                                                }
                                                        }                                         
                                                        Ti.API.info("start_id:"+rows.fieldByName('started_id')+",stopped_id:"+rows.fieldByName('stopped_id'));
                                                        //if duration < 1 minute, then hide it
                                                        var duration_result = parseFloat(rows.fieldByName('duration'))/60;
                                                        if(duration_result > 1){
                                                                duration_result = parseFloat(self.currency_formatted(parseFloat(rows.fieldByName('duration')/3600)));                                                                
                                                                if(_labour_item_temp_id_array.indexOf(rows.fieldByName('started_id')) === -1){     
                                                                        var temp_labour_item_price = parseFloat(self.currency_formatted(duration_result*rate_inc_gst));
                                                                        var temp_var = {
                                                                                id:temp_manager_user_id,
                                                                                name:manager_user_array[i].display_name,
                                                                                init_rate:init_rate,
                                                                                rate:rate_inc_gst,
                                                                                duration_seconds:(rows.fieldByName('duration') == null)?0:rows.fieldByName('duration'),
                                                                                duration:duration_result,
                                                                                started_id:rows.fieldByName('started_id'),
                                                                                stopped_id:rows.fieldByName('stopped_id'),
                                                                                started_logged:rows.fieldByName('started_logged'),
                                                                                stopped_logged:rows.fieldByName('stopped_logged'),
                                                                                amount:temp_labour_item_price,
                                                                                markup_amount:parseFloat(self.currency_formatted((parseFloat(1+_client_markup/100))*temp_labour_item_price)),
                                                                                display_price:0,
                                                                                is_markup:false,
                                                                                is_checked:true
                                                                        };                                                                        
                                                                        if(_temp_item_array.length > 0){//check exist data setting, if exist , then check it's has been marked up, checked, total marked up , total discount'
                                                                                for(var m=0,n=_temp_item_array.length;m<n;m++){
                                                                                        if(_temp_item_array[m].started_id == rows.fieldByName('started_id')){
                                                                                                temp_var.duration = _temp_item_array[m].duration;
                                                                                                temp_var.is_markup =_temp_item_array[m].is_markup;
                                                                                                temp_var.is_checked =_temp_item_array[m].is_checked;
                                                                                                temp_var.amount = parseFloat(self.currency_formatted(temp_var.duration*rate_inc_gst));
                                                                                                temp_var.markup_amount = parseFloat(self.currency_formatted((parseFloat(1+_client_markup/100))*temp_var.amount));
                                                                                                break;
                                                                                        }
                                                                                }
                                                                        }                                            
                                                                        temp_labour_item_price = 0;
                                                                        if(temp_var.is_markup){
                                                                                temp_labour_item_price = temp_var.markup_amount;   
                                                                        }else{
                                                                                temp_labour_item_price = temp_var.amount;
                                                                        }
                                                                        if(_markup > 0){
                                                                                temp_labour_item_price = parseFloat(self.currency_formatted(temp_labour_item_price*(1+_markup/100)));
                                                                        }
                                                                        if(_discount > 0){
                                                                                temp_labour_item_price = parseFloat(self.currency_formatted(temp_labour_item_price*(1-_discount/100)));
                                                                        }
                                                                        if(temp_var.is_checked){
                                                                                _labour_item_total_price += temp_labour_item_price;   
                                                                        }
                                                                        temp_var.display_price = self.currency_formatted(temp_labour_item_price);                                                                        
                                                                        _labour_item_temp_id_array.push(rows.fieldByName('started_id'));
                                                                        _labour_item_array.push(temp_var);
                                                                }
                                                        }else{
                                                                _labour_item_temp_id_array.push(rows.fieldByName('started_id'));
                                                        }
                                                        rows.next();
                                                }                          
                                                rows.close();
                                        }
                                }          
                                _final_price = _total_price += _labour_item_total_price;
                                Ti.API.info("_final_price2:"+_final_price);
                                       
                                _init_labour_manual_section(db);
                                
                                _init_row_header_view_and_footer_view('Labour','Hide Labour Items?',self.currency_formatted(_labour_item_total_price),_hide_labour_items);
                                _setup_row_for_invoice_labour_section();      
                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_labour_item_section');
                                return;
                        }                        
                }          
                
                function _init_labour_manual_section(db){
                        try{
                                if(_is_win_setup){
                                        _temp_item_array = _labour_manual_item_array;
                                }
                                _labour_manual_item_total_price = 0;
                                _labour_manual_item_array = [];
                                var sql = 'select * from my_'+_type+'_operation_manual where status_code=1 and '+_type+'_id='+_selected_job_id+' and id>1000000000 and id not in ('
                                +'select a.'+_type+'_operation_manual_id from my_'+_type+'_assigned_operation_manual as a where a.company_id='+_selected_company_id+')';    
                                var rows = db.execute(sql);
                                while(rows.isValidRow()){   
                                        var temp_rate = (rows.fieldByName('operation_rate') == '')?parseFloat(self.currency_formatted(0)):parseFloat(self.currency_formatted(parseFloat(rows.fieldByName('operation_rate'),10)));                                        
                                        var temp_duration = (rows.fieldByName('operation_duration') == '')?parseFloat(self.currency_formatted(0)):parseFloat(self.currency_formatted(parseFloat(rows.fieldByName('operation_duration'),10)));
                                        var temp_var = {
                                                id:rows.fieldByName('id'),
                                                invoice_id:_selected_job_invoice_id,
                                                name:rows.fieldByName('operation_user'),
                                                rate:temp_rate,
                                                duration:temp_duration,
                                                date:rows.fieldByName('operation_time'),
                                                display_price:0,
                                                is_checked:true                                                
                                        };
                                        
                                        if(_temp_item_array.length > 0){//check exist data setting, if exist , then check it's has been marked up, checked, total marked up , total discount'
                                                for(var m=0,n=_temp_item_array.length;m<n;m++){
                                                        if(_temp_item_array[m].id == rows.fieldByName('id')){
                                                                temp_var.is_checked =_temp_item_array[m].is_checked; 
                                                                break;
                                                        }
                                                }
                                        }                                            
                                        var temp_labour_manual_item_price =  0;
                                        if(_company_gst_exempt){//company no gst                                                
                                        }else{
                                                if(_tax_amount > 0){
                                                        temp_labour_manual_item_price = parseFloat(self.currency_formatted(temp_rate*(1+_tax_amount/100)))*parseFloat(temp_duration);
                                                }else{
                                                        temp_labour_manual_item_price = parseFloat(self.currency_formatted(temp_rate))*parseFloat(temp_duration);
                                                }
                                        }                                             
                                        if(_markup > 0){
                                                temp_labour_manual_item_price = parseFloat(self.currency_formatted(temp_labour_manual_item_price*(1+_markup/100)));
                                        }
                                        if(_discount > 0){
                                                temp_labour_manual_item_price = parseFloat(self.currency_formatted(temp_labour_manual_item_price*(1-_discount/100)));
                                        }
                                        if(temp_var.is_checked){
                                                _labour_manual_item_total_price += temp_labour_manual_item_price;   
                                        }
                                            
                                        temp_var.display_price = self.currency_formatted(temp_labour_manual_item_price);                                                                                                                 
                                        _labour_manual_item_array.push(temp_var);
                                        rows.next();
                                }         
                                rows.close();
                                _labour_item_total_price+=_labour_manual_item_total_price;
                                _final_price = _total_price += _labour_manual_item_total_price;
                                Ti.API.info("_labour_item_total_price3:"+_labour_item_total_price);
                                Ti.API.info("_final_price3:"+_final_price);                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_labour_manual_section');
                                return;
                        }                         
                }
                /**
                 * setup row for _init_invoice_material_section
                 */                  
                function _setup_row_for_invoice_material_section(){
                        try{            
                                _material_section_num = _section_no;
                                for(var i=0,j=_material_item_array.length;i<j;i++){                                        
                                        var row = Ti.UI.createTableViewRow({
                                                name:'material_item',
                                                filter_class:'material_item',
                                                className:'material_item',
                                                height:'auto',
                                                hasCheck:_material_item_array[i].is_checked?true:false,
                                                view_url:'job/edit/job_invoice_material.js',
                                                assigned_item_id:((_material_item_array[i].assigned_item_id == undefined) || (_material_item_array[i].assigned_item_id == null))?0:_material_item_array[i].assigned_item_id,
                                                library_item_id:((_material_item_array[i].library_item_id == undefined) || (_material_item_array[i].library_item_id == null))?0:_material_item_array[i].library_item_id,
                                                library_item_name:((_material_item_array[i].item_name == undefined) || (_material_item_array[i].item_name == null))?'':_material_item_array[i].item_name,
                                                price:((_material_item_array[i].price == undefined) || (_material_item_array[i].price == null))?0:_material_item_array[i].price,
                                                units:((_material_item_array[i].units == undefined) || (_material_item_array[i].units == null))?0:_material_item_array[i].units,
                                                inc_gst:((_material_item_array[i].inc_gst == undefined) || (_material_item_array[i].inc_gst == null))?0:_material_item_array[i].inc_gst,
                                                is_gst_exempt:((_material_item_array[i].is_gst_exempt == undefined) || (_material_item_array[i].is_gst_exempt == null))?0:_material_item_array[i].is_gst_exempt,
                                                amount:((_material_item_array[i].amount == undefined) || (_material_item_array[i].amount == null))?0:_material_item_array[i].amount,
                                                markup_amount:((_material_item_array[i].amount == undefined) || (_material_item_array[i].amount == null))?0:_material_item_array[i].markup_amount
                                        });
                                        
                                        var invoice_material_item_title_field = Ti.UI.createLabel({
                                                name:'material_item',
                                                top:3,
                                                bottom:28,
                                                width:200,
                                                height:'auto',
                                                textAlign:'left',
                                                left:10,
                                                text:((_material_item_array[i].item_name == undefined) || (_material_item_array[i].item_name == null))?'':_material_item_array[i].item_name,
                                                font:{
                                                        fontSize:self.font_size,
                                                        fontWeight:self.font_weight
                                                }                                                                                          
                                        });   
                                        row.add(invoice_material_item_title_field);   
                                        
                                        var invoice_material_item_markup_title_field = Ti.UI.createLabel({
                                                name:'material_item',
                                                bottom:3,
                                                width:100,
                                                height:25,
                                                textAlign:'left',
                                                left:10,
                                                text:'Mark up?',
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });   
                                        row.add(invoice_material_item_markup_title_field);                                           
                                        
                                        var item_markup = Ti.UI.createButton({
                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                name:'material_item_btn',
                                                bottom:3,
                                                title:_material_item_array[i].is_markup?'Yes':'No',                                        
                                                left:65,
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
                                        row.add(item_markup);                                       
                                        
                                        var price_label = Ti.UI.createLabel({
                                                name:'material_item',
                                                top:3,
                                                right:20,
                                                width:200,
                                                height:20,
                                                textAlign:'right',
                                                color:self.selected_value_font_color,
                                                text:_selected_currency+_material_item_array[i].display_price,
                                                borderRadius:8
                                        });
                                        row.add(price_label);       
                                        var units_label = Ti.UI.createLabel({
                                                name:'material_item',
                                                bottom:3,
                                                right:20,
                                                width:100,
                                                height:20,
                                                textAlign:'right',
                                                text:'  (Units:'+_material_item_array[i].units+')',
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size
                                                },                                                
                                                borderRadius:8
                                        });
                                        row.add(units_label);                                          
                                        self.data[_section_no].add(row);                                        
                                }
                                _section_no++;                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_invoice_material_section');
                                return;
                        }
                }     
                /**
                 * setup row for _init_invoice_labour_section
                 */                  
                function _setup_row_for_invoice_labour_section(){
                        try{
                                _labour_section_num = _section_no;
                                for(var i=0,j=_labour_item_array.length;i<j;i++){
                                        var row = Ti.UI.createTableViewRow({
                                                name:'labour_item',
                                                filter_class:'labour_item',
                                                className:'labour_item',
                                                height:55,
                                                hasCheck:_labour_item_array[i].is_checked?true:false,
                                                view_url:'job/edit/job_invoice_labour.js',        
                                                value:false,
                                                manager_user_id:((_labour_item_array[i].id == undefined) || (_labour_item_array[i].id == null))?0:_labour_item_array[i].id,
                                                manager_user_name:((_labour_item_array[i].name == undefined) || (_labour_item_array[i].name == null))?'':_labour_item_array[i].name,
                                                rate_per_hour:((_labour_item_array[i].rate == undefined) || (_labour_item_array[i].rate == null))?0:_labour_item_array[i].rate,
                                                duration:((_labour_item_array[i].duration == undefined) || (_labour_item_array[i].duration == null))?0:_labour_item_array[i].duration,
                                                started_id:((_labour_item_array[i].started_id == undefined) || (_labour_item_array[i].started_id == null))?0:_labour_item_array[i].started_id,
                                                stopped_id:((_labour_item_array[i].stopped_id == undefined) || (_labour_item_array[i].stopped_id == null))?0:_labour_item_array[i].stopped_id,
                                                started_logged:((_labour_item_array[i].started_logged == undefined) || (_labour_item_array[i].started_logged == null))?'':_labour_item_array[i].started_logged,
                                                stopped_logged:((_labour_item_array[i].stopped_logged == undefined) || (_labour_item_array[i].stopped_logged == null))?'':_labour_item_array[i].stopped_logged
                                        });
                                        
                                        var invoice_labour_item_title_field = Ti.UI.createLabel({
                                                name:'labour_item',
                                                top:3,
                                                width:200,
                                                height:20,
                                                textAlign:'left',
                                                left:10,
                                                text:((_labour_item_array[i].name == undefined) || (_labour_item_array[i].name == null))?'':_labour_item_array[i].name,
                                                font:{
                                                        fontSize:self.font_size,
                                                        fontWeight:self.font_weight
                                                }
                                        });   
                                        row.add(invoice_labour_item_title_field);       
                                        
                                        var invoice_labour_item_markup_title_field = Ti.UI.createLabel({
                                                name:'labour_item',
                                                bottom:3,
                                                width:100,
                                                height:25,
                                                textAlign:'left',
                                                left:10,
                                                text:'Mark up?',
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });   
                                        row.add(invoice_labour_item_markup_title_field);       
                                        
                                        var item_markup = Ti.UI.createButton({
                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                name:'labour_item_btn',
                                                bottom:3,
                                                title:_labour_item_array[i].is_markup?'Yes':'No',                                            
                                                left:65,
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
                                        row.add(item_markup);       
                                        
                                        var price_label = Ti.UI.createLabel({
                                                name:'labour_item',
                                                top:3,
                                                right:20,
                                                width:200,
                                                height:20,
                                                textAlign:'right',
                                                color:self.selected_value_font_color,
                                                text:_selected_currency+_labour_item_array[i].display_price,
                                                borderRadius:8
                                        });
                                        row.add(price_label);      
                                        
                                        var units_input_field = Ti.UI.createTextField({
                                                name:'labour_item_hour',
                                                hintText:'0.00',
                                                bottom:3,
                                                right:23,
                                                width:50,
                                                height:25,
                                                textAlign:'center',
                                                value:((_labour_item_array[i].duration == undefined) || (_labour_item_array[i].duration == null))?'0.00':(parseFloat(_labour_item_array[i].duration)+''),
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
                                        
                                        units_input_field.addEventListener('change',function(e){
                                                if(!self.check_valid_price(e.value)){
                                                        self.show_message('Please enter number greater than zero.');
                                                        this.value = e.source.row_object.duration;
                                                        return;                                                
                                                }                                   
                                                _refresh_total_price('update_duration',e.value,e.source.section_object,e.source.row_object);                                                 
                                        });
                                        
                                        units_input_field.addEventListener('focus',function(e){
                                                _selected_units_input_field_object = e.source;
                                                _is_units_input_field_focused = true;
                                        });                                        
                                        
                                        units_input_field.addEventListener('blur',function(e){
                                                _is_units_input_field_focused = false;
                                                _selected_units_input_field_object = null;
                                                _refresh_total_price('update_duration',e.value,e.source.section_object,e.source.row_object);                                                       
                                        });
                                        
                                        var units_label = Ti.UI.createLabel({
                                                bottom:3,
                                                right:70,
                                                width:100,
                                                height:25,
                                                textAlign:'right',
                                                text:'Duration',
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });
                                        row.add(units_label);     
                                        var units_hour_label = Ti.UI.createLabel({
                                                bottom:3,
                                                right:16,
                                                width:5,
                                                height:25,
                                                textAlign:'left',
                                                text:'h',
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });
                                        row.add(units_hour_label); 
                                        self.data[_section_no].add(row);                                        
                                }
                                
                                _setup_row_for_invoice_labour_manual_section();
                                _section_no++;                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_invoice_labour_section');
                                return;
                        }
                }
                
                function _setup_row_for_invoice_labour_manual_section(){
                        try{                         
                                for(var i=0,j=_labour_manual_item_array.length;i<j;i++){
                                        var row = Ti.UI.createTableViewRow({
                                                name:'labour_manual_item',
                                                filter_class:'labour_manual_item',
                                                className:'labour_manual_item',
                                                height:55,
                                                hasCheck:_labour_manual_item_array[i].is_checked?true:false,
                                                view_url:'job/edit/job_invoice_labour.js',
                                                value:false,
                                                operation_manual_id:((_labour_manual_item_array[i].id == undefined) || (_labour_manual_item_array[i].id == null))?0:_labour_manual_item_array[i].id,                                                
                                                display_name:((_labour_manual_item_array[i].name == undefined) || (_labour_manual_item_array[i].name == null))?'':_labour_manual_item_array[i].name,
                                                rate:((_labour_manual_item_array[i].rate == undefined) || (_labour_manual_item_array[i].rate == null))?0:_labour_manual_item_array[i].rate,
                                                duration:((_labour_manual_item_array[i].duration == undefined) || (_labour_manual_item_array[i].duration == null))?0:_labour_manual_item_array[i].duration,
                                                date:((_labour_manual_item_array[i].date == undefined) || (_labour_manual_item_array[i].date == null))?'':_labour_manual_item_array[i].date                                                
                                        });
                                        
                                        var invoice_labour_manual_item_title_field = Ti.UI.createLabel({
                                                name:'labour_manual_item',
                                                top:3,
                                                width:200,
                                                height:20,
                                                textAlign:'left',
                                                left:10,
                                                text:((_labour_manual_item_array[i].name == undefined) || (_labour_manual_item_array[i].name == null))?'':_labour_manual_item_array[i].name,
                                                font:{
                                                        fontSize:self.font_size,
                                                        fontWeight:self.font_weight
                                                }
                                        });   
                                        row.add(invoice_labour_manual_item_title_field);      
                                        
                                        var item_edit = Ti.UI.createButton({
                                                backgroundImage:self.get_file_path('image', 'BUTT_grn_off.png'),
                                                name:'labour_manual_item_btn',
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
                                        
                                        var price_label = Ti.UI.createLabel({
                                                name:'labour_manual_item',
                                                top:3,
                                                right:20,
                                                width:200,
                                                height:20,
                                                textAlign:'right',
                                                color:self.selected_value_font_color,
                                                text:_selected_currency+_labour_manual_item_array[i].display_price,
                                                borderRadius:8
                                        });
                                        row.add(price_label);      
                                        
                                        var units_input_field = Ti.UI.createTextField({
                                                name:'labour_manual_item_hour',
                                                hintText:'0.00',
                                                bottom:3,
                                                right:23,
                                                width:50,
                                                height:25,
                                                textAlign:'center',
                                                value:((_labour_manual_item_array[i].duration == undefined) || (_labour_manual_item_array[i].duration == null))?'0.00':(parseFloat(_labour_manual_item_array[i].duration)+''),
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
                                        
                                        units_input_field.addEventListener('change',function(e){
                                                if(!self.check_valid_price(e.value)){
                                                        self.show_message('Please enter number greater than zero.');
                                                        this.value = e.source.row_object.duration;
                                                        return;                                                
                                                }                                   
                                                _refresh_labour_manual_item_duration(e.source.row_object.operation_manual_id,e.value);
                                                _refresh_total_price('update_manual_duration',e.value,e.source.section_object,e.source.row_object);                                                 
                                        });
                                        
                                        units_input_field.addEventListener('focus',function(e){
                                                _selected_units_input_field_object = e.source;
                                                _is_units_input_field_focused = true;
                                        });                                        
                                        
                                        units_input_field.addEventListener('blur',function(e){
                                                _is_units_input_field_focused = false;
                                                _selected_units_input_field_object = null;
                                                _refresh_labour_manual_item_duration(e.source.row_object.operation_manual_id,e.value);
                                                _refresh_total_price('update_manual_duration',e.value,e.source.section_object,e.source.row_object);                                                       
                                        });
                                        
                                        var units_label = Ti.UI.createLabel({
                                                name:'labour_manual_item',
                                                bottom:3,
                                                right:70,
                                                width:100,
                                                height:25,
                                                textAlign:'right',
                                                text:'Duration',
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });
                                        row.add(units_label);     
                                        var units_hour_label = Ti.UI.createLabel({
                                                name:'labour_manual_item',
                                                bottom:3,
                                                right:16,
                                                width:5,
                                                height:25,
                                                textAlign:'left',
                                                text:'h',
                                                color:self.selected_value_font_color,
                                                font:{
                                                        fontSize:self.small_font_size
                                                }
                                        });
                                        row.add(units_hour_label); 
                                        self.data[_section_no].add(row);                                        
                                }              
                                
                                var add_row = Ti.UI.createTableViewRow({
                                        name:'labour_manual_add_item',
                                        filter_class:'labour_manual_add_item',
                                        className:'labour_manual_add_item',
                                        height:55,
                                        hasCheck:false,
                                        view_url:'job/edit/job_invoice_add_labour_manual.js',
                                        value:false                                              
                                });
                                
                                var invoice_labour_manual_add_item_title_field = Ti.UI.createLabel({
                                        name:'labour_manual_add_item',
                                        width:200,
                                        height:20,
                                        textAlign:'center',
                                        text:'Add Operation Time',
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });   
                                add_row.add(invoice_labour_manual_add_item_title_field);  
                                self.data[_section_no].add(add_row);        
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _setup_row_for_invoice_labour_manual_section');
                                return;
                        }                        
                }
                /**
                 *  init invoice description field
                 */                            
                function _init_invoice_description_section(db){
                        try{
                                _init_row_header_view('Description',(_invoice_type =='auto'?true:false));
                                var invoice_description_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_description',
                                        filter_class:'set_invoice_description',
                                        valueRequired:true,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter description.',//for check value
                                        height:100
                                });
                                self.invoice_description_content_field = Ti.UI.createTextArea({
                                        width:(self.is_ipad())?self.screen_width-100:self.screen_width-30,
                                        height:90,
                                        textAlign:'left',
                                        left:10,
                                        right:10,
                                        value:_invoice_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        suppressReturn:false
                                });
                                if(self.is_ios_7_plus()){
                                        self.invoice_description_content_field.borderWidth=1;
                                        self.invoice_description_content_field.borderColor= '#ccc';
                                        self.invoice_description_content_field.borderRadius= 5;
                                }                                
                                invoice_description_field.add(self.invoice_description_content_field);                       
                                self.data[_section_no].add(invoice_description_field);   
                                self.invoice_description_content_field.addEventListener('change',function(e){
                                        _invoice_description = e.value;
                                        _is_make_changed = true;
                                });
                                self.invoice_description_content_field.addEventListener('focus',function(e){
                                        _is_invoice_description_content_field_focused = true;
                                });   
                                self.invoice_description_content_field.addEventListener('blur',function(e){
                                        _is_invoice_description_content_field_focused = false;
                                });                                  
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_invoice_description_section');
                                return;
                        }                        
                }                               
                
                function _init_invoice_sum_total_section(db){
                        try{
                                _init_row_header_view('',false);
                                //total
                                var invoice_total_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_total',
                                        filter_class:'set_invoice_total'
                                });
                                var invoice_total_title_field = Ti.UI.createLabel({
                                        top:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'Total:',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });   
                                invoice_total_field.add(invoice_total_title_field);
                                var invoice_total_title_comment_field = Ti.UI.createLabel({
                                        bottom:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'(Inc '+_tax_name+')',
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });   
                                invoice_total_field.add(invoice_total_title_comment_field);                                
                                self.invoice_total_content_field = Ti.UI.createLabel({
                                        width:200,
                                        height:self.default_table_view_row_height,
                                        textAlign:'right',
                                        right:10,
                                        text:_selected_currency+self.currency_formatted(_total_price),
                                        color:self.selected_value_font_color
                                });
                                invoice_total_field.add(self.invoice_total_content_field);
                                self.data[_section_no].add(invoice_total_field);  
                                
                                //markup
                                var invoice_total_markup_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_total_markup',
                                        filter_class:'set_invoice_total_markup'
                                });
                                var invoice_total_markup_title_field = Ti.UI.createLabel({
                                        top:3,
                                        width:150,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'Total Markup:',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });   
                                invoice_total_markup_field.add(invoice_total_markup_title_field);
                                var invoice_total_markup_comment_field = Ti.UI.createLabel({
                                        bottom:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'(e.g 20%)',
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });   
                                invoice_total_markup_field.add(invoice_total_markup_comment_field);                                     
                                self.invoice_total_markup_content_field = Ti.UI.createTextField({
                                        hintText:'0.00',
                                        width:150,
                                        height:self.default_table_view_row_height,
                                        textAlign:'right',
                                        right:30,
                                        value:(_markup > 0)?_markup:'',
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
                                        color:self.selected_value_font_color
                                });
                                invoice_total_markup_field.add(self.invoice_total_markup_content_field);
                                var invoice_markup_percentage_field = Ti.UI.createLabel({
                                        width:15,
                                        height:20,
                                        textAlign:'left',
                                        right:10,
                                        text:'%',
                                        color:self.selected_value_font_color
                                });   
                                invoice_total_markup_field.add(invoice_markup_percentage_field);                                  
                                self.invoice_total_markup_content_field.addEventListener('return',function(e){     
                                        if(!self.check_valid_price(e.value)){
                                                self.show_message('Please enter number greater than zero.');
                                                this.value = _markup;
                                                return;                                                
                                        }                                           
                                        if((parseInt(e.value) > 100) || (parseInt(e.value) <0)){
                                                self.show_message('Please enter number between 0 ~100.');
                                                this.value = _markup;
                                                return;
                                        }                
                                        self.display_indicator('Checking Data ...',false);
                                        _markup = e.value;    
                                        setTimeout(function(){                                                
                                                _is_invoice_total_markup_content_field_focused = false;
                                                //_refresh_total_price('change_markup_or_discount',null,null,null);      
                                                _is_make_changed = true;
                                                self.hide_indicator();
                                        },2000);                                        
                                                   
                                });
                                self.invoice_total_markup_content_field.addEventListener('focus',function(e){ 
                                        _is_invoice_total_markup_content_field_focused = true;
                                });                                  
                                self.invoice_total_markup_content_field.addEventListener('blur',function(e){
                                        Ti.API.info("test3");
                                        _markup = e.value; 
                                        _is_invoice_total_markup_content_field_focused = false;
                                        _refresh_total_price('change_markup_or_discount',null,null,null);   
                                        _is_make_changed = true;
                                });                                
                                self.data[_section_no].add(invoice_total_markup_field);    
                                
                                //discount
                                var invoice_discount_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_discount',
                                        filter_class:'set_invoice_discount'
                                });
                                var invoice_discount_title_field = Ti.UI.createLabel({
                                        top:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'Discount:',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });   
                                invoice_discount_field.add(invoice_discount_title_field);
                                var invoice_discount_title_comment_field = Ti.UI.createLabel({
                                        bottom:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'(e.g 10%)',
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });   
                                invoice_discount_field.add(invoice_discount_title_comment_field);                                 
                                self.invoice_discount_content_field = Ti.UI.createTextField({
                                        hintText:'0.00',
                                        width:200,
                                        height:20,
                                        textAlign:'right',
                                        right:30,
                                        value:(_discount>0)?_discount:'',
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
                                        color:self.selected_value_font_color
                                });
                                invoice_discount_field.add(self.invoice_discount_content_field);
                                var invoice_discount_percentage_field = Ti.UI.createLabel({
                                        width:15,
                                        height:20,
                                        textAlign:'left',
                                        right:10,
                                        text:'%',
                                        color:self.selected_value_font_color
                                });   
                                invoice_discount_field.add(invoice_discount_percentage_field);                                   
                                
                                self.invoice_discount_content_field.addEventListener('return',function(e){
                                        if(!self.check_valid_price(e.value)){
                                                self.show_message('Please enter number greater than zero.');
                                                this.value = _discount;
                                                return;                                                
                                        }                                          
                                        if((parseInt(e.value) > 100) || (parseInt(e.value) <0)){
                                                self.show_message('Please enter number between 0 ~100.');
                                                this.value = _discount;
                                                return;
                                        }
                                        self.display_indicator('Checking Data ...',false);
                                        _discount = e.value;
                                        setTimeout(function(){                                                
                                                _is_invoice_discount_content_field_focused = false;
                                                //_refresh_total_price('change_markup_or_discount',null,null,null);      
                                                _is_make_changed = true;
                                                self.hide_indicator();
                                        },2000);
                                });
                                
                                self.invoice_discount_content_field.addEventListener('focus',function(e){
                                        _is_invoice_discount_content_field_focused = true;
                                });                                
                                
                                self.invoice_discount_content_field.addEventListener('blur',function(e){
                                        _discount = e.value;
                                        _is_invoice_discount_content_field_focused = false;
                                        _is_make_changed = true;
                                        Ti.API.info('_discount:'+_discount);
                                        _refresh_total_price('change_markup_or_discount',null,null,null);                                        
                                });
                                self.data[_section_no].add(invoice_discount_field); 
                                
                                //final price
                                var invoice_final_price_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_final_price',
                                        filter_class:'set_invoice_final_price'
                                });
                                var invoice_final_price_title_field = Ti.UI.createLabel({
                                        top:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'Final Price:',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });   
                                invoice_final_price_field.add(invoice_final_price_title_field);
                                var invoice_final_price_comment_field = Ti.UI.createLabel({
                                        bottom:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'(Inc '+_tax_name+')',
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });   
                                invoice_final_price_field.add(invoice_final_price_comment_field);                                
                                self.invoice_final_price_content_field = Ti.UI.createLabel({
                                        width:200,
                                        height:self.default_table_view_row_height,
                                        textAlign:'right',
                                        right:10,
                                        text:_selected_currency+self.currency_formatted(_final_price),
                                        color:self.selected_value_font_color
                                });
                                invoice_final_price_field.add(self.invoice_final_price_content_field);
                                self.data[_section_no].add(invoice_final_price_field);                                     
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_invoice_sum_total_section');
                                return;
                        }                        
                }
                
                function _init_invoice_sum_total_section_for_manual(db){
                        try{
                                _init_row_header_view('',false);              
                                //final price
                                var invoice_final_price_field = Ti.UI.createTableViewRow({
                                        className:'set_invoice_final_price',
                                        filter_class:'set_invoice_final_price'
                                });
                                var invoice_final_price_title_field = Ti.UI.createLabel({
                                        top:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'Final Price:',
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        }
                                });   
                                invoice_final_price_field.add(invoice_final_price_title_field);
                                var invoice_final_price_comment_field = Ti.UI.createLabel({
                                        bottom:3,
                                        width:100,
                                        height:20,
                                        textAlign:'left',
                                        left:10,
                                        text:'(Inc '+_tax_name+')',
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.small_font_size
                                        }
                                });   
                                invoice_final_price_field.add(invoice_final_price_comment_field);                                
                                self.invoice_final_price_content_field = Ti.UI.createTextField({
                                        hintText:_selected_currency+'0.00',
                                        width:200,
                                        height:self.default_table_view_row_height,
                                        textAlign:'right',
                                        right:10,
                                        value:'',
                                        returnKeyType: Ti.UI.RETURNKEY_RETURN,
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
                                        color:self.selected_value_font_color
                                });
                                invoice_final_price_field.add(self.invoice_final_price_content_field);
                                
                                self.invoice_final_price_content_field.addEventListener('focus',function(e){  
                                        _is_invoice_final_price_content_field_focused = true;
                                        if(self.currency_formatted(_final_price) === '0.00'){                                                
                                        }else{
                                                this.value = self.currency_formatted(_final_price);   
                                        }                                                                               
                                });  
                                
                                self.invoice_final_price_content_field.addEventListener('return',function(e){    
                                        _is_invoice_final_price_content_field_focused = false;
                                        _final_price = e.value;                                        
                                        var temp_final_price  = _final_price = self.replace(_final_price,_selected_currency,'');
                                        _final_price = self.currency_formatted(_final_price);
                                        
                                        //check final price                              
                                        if(isNaN(parseFloat(temp_final_price))){
                                                self.show_message('Final Price: Wrong currency format.\n (e.g '+_selected_currency+'123.45)');                                                                                       
                                        }else{
                                                if(!self.check_valid_price(_final_price)){
                                                        self.show_message('Final Price: Wrong currency format.\n (e.g '+_selected_currency+'123.45)');                                           
                                                }else{                                                 
                                                        this.value =_selected_currency+_final_price; 
                                                        _is_make_changed = true;
                                                }
                                        }                                                                         
                                });                                                               
                                
                                self.data[_section_no].add(invoice_final_price_field);                                     
                                _section_no++;   
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_invoice_sum_total_section_for_manual');
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
                
                function _refresh_total_price(filter_class,temp_markup,section,row){
                        try{
                                Ti.API.info("test4");
                                Ti.API.info("filter_class:"+filter_class);
                                var is_refresh_total_price = false;
                                switch(filter_class){
                                        case 'update_duration':
                                                for(var i=0,j=_labour_item_array.length;i<j;i++){
                                                        if(_labour_item_array[i].stopped_id == row.stopped_id){
                                                                _labour_item_array[i].duration =  temp_markup;
                                                                _labour_item_array[i].amount = self.currency_formatted(parseFloat(temp_markup)*parseFloat(row.rate_per_hour));
                                                                _labour_item_array[i].markup_amount =  ((parseFloat(1+_client_markup/100))*parseFloat( _labour_item_array[i].amount));
                                                                var temp_labour_item_price = 0;
                                                                if(_labour_item_array[i].is_markup){
                                                                        temp_labour_item_price = _labour_item_array[i].markup_amount;
                                                                }else{
                                                                        temp_labour_item_price = _labour_item_array[i].amount;
                                                                }                                                               
                                                                if(_markup > 0){//total markup
                                                                        temp_labour_item_price = parseFloat(self.currency_formatted(temp_labour_item_price*(1+_markup/100)));
                                                                }
                                                                if(_discount > 0){
                                                                        temp_labour_item_price = parseFloat(self.currency_formatted(temp_labour_item_price*(1-_discount/100)));
                                                                }
                                                                var labour_old_price = _labour_item_array[i].display_price; 
                                                                _labour_item_array[i].display_price = temp_labour_item_price;
                                                                row.children[3].text = _selected_currency+self.currency_formatted(temp_labour_item_price);         
                                                                
                                                                if(_labour_item_array[i].is_checked){
                                                                        Ti.API.info("_labour_item_total_price:"+_labour_item_total_price);
                                                                        _labour_item_total_price = parseFloat(_labour_item_total_price)- parseFloat(labour_old_price) +parseFloat(temp_labour_item_price);   
                                                                }                                                            
                                                                break;
                                                        }
                                                }                                                
                                                Ti.API.info("_labour_item_total_price:"+_labour_item_total_price);
                                                Ti.API.info("_material_item_total_price:"+_material_item_total_price);
                                                _final_price = _total_price = _material_item_total_price +_labour_item_total_price;
                                                section.headerView.children[1].text = 'Sub Total: '+_selected_currency+self.currency_formatted(_labour_item_total_price);   
                                                is_refresh_total_price = true;
                                                break;
                                        case 'update_manual_duration':
                                                for(i=0,j=_labour_manual_item_array.length;i<j;i++){
                                                        Ti.API.info("row.operation_manual_id:"+row.operation_manual_id);
                                                        if(_labour_manual_item_array[i].id == row.operation_manual_id){
                                                                _labour_manual_item_array[i].duration = temp_markup;
                                                                Ti.API.info("_labour_manual_item_array[i].duration:"+_labour_manual_item_array[i].duration);
                                                                
                                                                var temp_labour_manual_item_price  = parseFloat(self.currency_formatted(parseFloat(_labour_manual_item_array[i].duration)*(parseFloat(_labour_manual_item_array[i].rate))));                                                  
                                                                if(_company_gst_exempt){//company no gst                                                
                                                                }else{
                                                                        if(_tax_amount > 0){
                                                                                temp_labour_manual_item_price = parseFloat(self.currency_formatted(parseFloat(_labour_manual_item_array[i].duration)*(parseFloat(_labour_manual_item_array[i].rate)*(1+_tax_amount/100))));                                                  
                                                                        }
                                                                }                                                                 
                                                                
                                                                if(_markup > 0){//total markup
                                                                        temp_labour_manual_item_price = parseFloat(self.currency_formatted(temp_labour_manual_item_price*(1+_markup/100)));
                                                                }
                                                                if(_discount > 0){
                                                                        temp_labour_manual_item_price = parseFloat(self.currency_formatted(temp_labour_manual_item_price*(1-_discount/100)));
                                                                }
                                                                var labour_manual_old_price = _labour_manual_item_array[i].display_price; 
                                                                _labour_manual_item_array[i].display_price = temp_labour_manual_item_price;
                                                                row.children[2].text = _selected_currency+self.currency_formatted(temp_labour_manual_item_price);         
                                                                
                                                                if(_labour_manual_item_array[i].is_checked){
                                                                        _labour_item_total_price = parseFloat(_labour_item_total_price)- parseFloat(labour_manual_old_price) +parseFloat(temp_labour_manual_item_price);   
                                                                }                                                            
                                                                break;
                                                        }
                                                }    

                                                _final_price = _total_price = _material_item_total_price +_labour_item_total_price;                                                               
                                                section.headerView.children[1].text = 'Sub Total: '+_selected_currency+self.currency_formatted(_labour_item_total_price);    
                                                is_refresh_total_price = true;
                                                break;                                                
                                        case 'change_markup_or_discount':
                                                self.display ();
                                                break;
                                        case 'material_item':
                                        case 'labour_item':
                                        case 'labour_manual_item':
                                                if(filter_class == 'material_item'){
                                                        section.headerView.children[1].text = 'Sub Total: '+_selected_currency+self.currency_formatted(_material_item_total_price); 
                                                }
                                                if(filter_class == 'labour_item' || filter_class == 'labour_manual_item'){
                                                        section.headerView.children[1].text = 'Sub Total: '+_selected_currency+self.currency_formatted(_labour_item_total_price); 
                                                }    
                                                _final_price = _total_price = _material_item_total_price +_labour_item_total_price;
                                                is_refresh_total_price = true;
                                                break;                                                                                             
                                        case 'material_item_btn':
                                        case 'labour_item_btn':
                                                if(row.hasCheck){        
                                                        if(filter_class == 'material_item_btn'){
                                                                section.headerView.children[1].text = 'Sub Total: '+_selected_currency+self.currency_formatted(_material_item_total_price);
                                                        }
                                                        if(filter_class == 'labour_item_btn'){
                                                                section.headerView.children[1].text = 'Sub Total: '+_selected_currency+self.currency_formatted(_labour_item_total_price);
                                                        }                                                        
                                                        _final_price = _total_price = _material_item_total_price +_labour_item_total_price;
                                                        is_refresh_total_price = true;
                                                }                                                                                                  
                                                break;                                         
                                        default:                                                 
                                }   
                                
                                if(is_refresh_total_price){                           
                                        self.invoice_total_content_field.text = _selected_currency+self.currency_formatted(_total_price);  
                                        self.invoice_final_price_content_field.text = _selected_currency+self.currency_formatted(_final_price);                                                       
                                }
                        }
                        catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_total_price');
                                return;
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
                
                //remove selected job operation manual
                function _remove_selected_job_operation_manual(operationManualString){
                        try{
                                Ti.API.info(operationManualString);
                                var array = JSON.parse(operationManualString);
                                var operation_manual_id_array = [];
                                for(var i=0,j=array.length;i<j;i++){
                                        Ti.API.info(array[i]);
                                        operation_manual_id_array.push(array[i].operation_manual_id);
                                        Ti.API.info(array[i].operation_manual_id);
                                }
                                if(operation_manual_id_array.length > 0){
                                        var db = Titanium.Database.open(self.get_db_name());
                                        db.execute('delete from my_job_operation_manual where id in ('+operation_manual_id_array.join(',')+')');
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _remove_selected_job_operation_manual');
                                return false; 
                        }                         
                }
                
                function _refresh_labour_manual_item_duration(item_id,duration){
                        try{                                
                                var db = Titanium.Database.open(self.get_db_name());
                                var row = db.execute('select * from my_'+_type+'_operation_manual where id=?',item_id);
                                if(row.isValidRow()){
                                        if(row.fieldByName('operation_duration') != duration){
                                                db.execute('update my_'+_type+'_operation_manual set operation_duration=\''+(duration == ''?0:duration)+'\' where id=?',item_id);
                                        }
                                }
                                row.close();
                                db.close();
                                for(var m=0,n=_labour_manual_item_array.length;m<n;m++){
                                        if(_labour_manual_item_array[m].id == item_id){
                                                _labour_manual_item_array[m].duration = duration;
                                                break;
                                        }
                                }                                                                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _refresh_labour_manual_item_duration');
                                return;         
                        }
                }                
        }
        
        win.addEventListener('focus',function(){
                try{
                        if(job_base_invoice_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_invoice_page.prototype = new F();
                                job_base_invoice_page.prototype.constructor = job_base_invoice_page;
                                job_base_invoice_page_obj = new job_base_invoice_page();
                                job_base_invoice_page_obj.init();
                        }else{
                                job_base_invoice_page_obj.display();
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });
        
        win.addEventListener('close',function(){
                try{
                        job_base_invoice_page_obj.close_window();
                        job_base_invoice_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());
