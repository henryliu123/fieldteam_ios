//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_edit_job_detail_page_obj = null;
        function job_edit_job_detail_page(){
                var self = this;
                var window_source = 'job_edit_job_detail_page';
                win.title = self.ucfirst(win.type)+' Detail';
                //public method
                /**
                 *  override init  function of parent class: fieldteam.js
                 */                  
                self.init = function(){
                        try{         
                                self.init_auto_release_pool(win);
                                self.data = [];//define public member
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Done','Main,Back');
                                //init vars and fields
                                self.init_vars();
                                if((_type === 'quote')&&(_job_status_code_hide_id_value === 3)){
                                        _init_job_id_field();
                                }
                                _init_client_field();
                                _init_address_field();
                                _init_order_source_code_field();
                                _init_order_reference_field();
                                _init_strata_plan_field();
                                _init_job_title_field();
                                _init_job_due_field();
                                if(_type === 'job'){
                                        _init_job_priority_field();
                                }
                                _init_job_status_field();
                               

                                if((_created != null)&&(_created != undefined)&&(_created != 0)&&(_created != '')){
                                        _init_job_created_field();
                                }
                                if((_modified != null)&&(_modified != undefined)&&(_modified != 0)&&(_modified != '')){
                                        _init_job_modified_field();
                                }                                    
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_selected_field_object != null){
                                                _selected_field_object.blur();
                                        }
                                });                                
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
                                var db = Titanium.Database.open(self.get_db_name());
                                var selected_job_obj = db.execute('SELECT * FROM my_'+_type+' WHERE id=?',_selected_job_id);
                                if(_type == 'job'){
                                        _job_priority_code_hide_id_value = (selected_job_obj.fieldByName(_type+'_priority_code')===null)?0:selected_job_obj.fieldByName(_type+'_priority_code');
                                }else{
                                        var job_obj_after_quote_accepted = db.execute('SELECT * FROM my_job WHERE id=?',selected_job_obj.fieldByName('job_id'));
                                        if((job_obj_after_quote_accepted.getRowCount() > 0) &&(job_obj_after_quote_accepted.isValidRow())){
                                                _job_id_after_accepted_quote = job_obj_after_quote_accepted.fieldByName('reference_number');
                                        }
                                }
                                _client_id = (selected_job_obj.fieldByName('client_id') === null)?0:selected_job_obj.fieldByName('client_id');
                                _job_title = (selected_job_obj.fieldByName('title') === null)?'':selected_job_obj.fieldByName('title');
                                _old_job_status_code_hide_id_value = _job_status_code_hide_id_value = (selected_job_obj.fieldByName(_type+'_status_code') === null)?0:selected_job_obj.fieldByName(_type+'_status_code');
                                _order_reference = selected_job_obj.fieldByName('order_reference');
                                _site_or_sp_name = (selected_job_obj.fieldByName('sp') === null)?'':selected_job_obj.fieldByName('sp');
                                _sub_number = (selected_job_obj.fieldByName('sub_number') === null)?'':selected_job_obj.fieldByName('sub_number');
                                _allocated_hours = (selected_job_obj.fieldByName('allocated_hours') === null)?'':selected_job_obj.fieldByName('allocated_hours');
                                _unit_number = (selected_job_obj.fieldByName('unit_number') === null)?'':selected_job_obj.fieldByName('unit_number');
                                _street_number = (selected_job_obj.fieldByName('street_number') === null)?'':selected_job_obj.fieldByName('street_number');
                                _street_type_id = (selected_job_obj.fieldByName('locality_street_type_id')=== null)?0:selected_job_obj.fieldByName('locality_street_type_id');
                                _street_type = (selected_job_obj.fieldByName('street_type') === null)?'':selected_job_obj.fieldByName('street_type');
                                _street = ((selected_job_obj.fieldByName('street') === null)?'':selected_job_obj.fieldByName('street'));
                                _street = self.display_correct_street(_street,_street_type);
                                _suburb_id = (selected_job_obj.fieldByName('locality_suburb_id')=== null)?0:selected_job_obj.fieldByName('locality_suburb_id');
                                _suburb = (selected_job_obj.fieldByName('suburb') === null)?'':selected_job_obj.fieldByName('suburb');
                                 _postcode = (selected_job_obj.fieldByName('postcode') === null)?'':selected_job_obj.fieldByName('postcode');
                                _state_id = (selected_job_obj.fieldByName('locality_state_id') === null)?0:selected_job_obj.fieldByName('locality_state_id');
                                _due =  (selected_job_obj.fieldByName('due') === null)?'':selected_job_obj.fieldByName('due');
                                _order_source_code = (selected_job_obj.fieldByName('order_source_code') === null)?0:selected_job_obj.fieldByName('order_source_code');
                                _descriptionText = (selected_job_obj.fieldByName('description') === null)?'':selected_job_obj.fieldByName('description');
                                _bookingNoteText = (selected_job_obj.fieldByName('booking_note') === null)?'':selected_job_obj.fieldByName('booking_note');
                                _latitudeText = (selected_job_obj.fieldByName('latitude') === null)?'':selected_job_obj.fieldByName('latitude');
                                _longitudeText = (selected_job_obj.fieldByName('longitude') === null)?'':selected_job_obj.fieldByName('longitude');
                                _created = (selected_job_obj.fieldByName('created') === null)?null:selected_job_obj.fieldByName('created');
                                _modified = (selected_job_obj.fieldByName('modified') === null)?null:selected_job_obj.fieldByName('modified');                                
                                if(_state_id > 0){
                                        var selected_state_obj = db.execute('SELECT * FROM my_locality_state WHERE id=?',_state_id);
                                        if((selected_state_obj.getRowCount() > 0)&&(selected_state_obj.isValidRow())){
                                                _state = selected_state_obj.fieldByName('state');
                                        }
                                        selected_state_obj.close();
                                }
                                selected_job_obj.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                                
                };                
                /**
                 *  override nav_right_btn_click_event  function of parent class: fieldteam.js
                 */                    
                self.nav_right_btn_click_event = function(e){
                        try{
                                var error_string = '';
                                for(var i=0,j=self.data.length;i<j;i++){
                                        if(self.data[i].valueRequired){
                                                if(self.data[i].valueType === 'text'){
                                                        if(self.data[i].children[self.data[i].valuePosition-1].text === ''){
                                                                error_string += self.data[i].valuePrompt+'\n';
                                                        }
                                                }else{
                                                        if(self.data[i].children[self.data[i].valuePosition-1].value === ''){
                                                                error_string += self.data[i].valuePrompt+'\n';
                                                        }
                                                }
                                        }
                                }

                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return;
                                }                                
                                if(_check_if_exist_change()){                                        
                                        var db = Titanium.Database.open(self.get_db_name());
                                        if(_status_reason !=''){
                                                var d = new Date();
                                                var new_time_value = parseInt(d.getTime(), 10);                                                
                                                db.execute('INSERT INTO my_'+_type+'_status_log (id,local_id,'+_type+'_id,'+_type+'_status_code,reason,'+
                                                        'manager_user_id,status_code,changed)'+
                                                        'VALUES(?,?,?,?,?,?,?,?)',
                                                        new_time_value,
                                                        _selected_company_id+'-'+_selected_user_id+'-'+new_time_value,
                                                        _selected_job_id,
                                                        _job_status_code_hide_id_value,
                                                        _status_reason,
                                                        _selected_user_id,
                                                        1,
                                                        1);                                                
                                        }

                                        //first check if exist or not in local database
                                        
                                        var rows = db.execute('SELECT * FROM my_'+_type+' WHERE status_code=1 and company_id=? and id=?',_selected_company_id,_selected_job_id);
                                        var row_count = rows.getRowCount();
                                        rows.close();
                                        db.close();
                                        if(row_count > 0){
                                                if(_type === 'job'){
                                                        _update_job_table();
                                                }else{
                                                        _update_quote_table();
                                                }
                                        }else{
                                                if(_type === 'job'){
                                                        _insert_into_job_table();
                                                }else{
                                                        _insert_into_quote_table();
                                                }
                                        }
                                }
                                
                                //close timer if set job status to "Completed'"
                                if((_type === 'job') && (_old_job_status_code_hide_id_value !=_job_status_code_hide_id_value) && (_job_status_code_hide_id_value == 1)){                                                
                                        var action = "stop";
                                        db = Titanium.Database.open(self.get_db_name());
                                        rows = db.execute('SELECT * from my_'+_type+'_operation_log WHERE '+_type+'_id=? and manager_user_id=? and status_code=1 order by logged desc,id desc',_selected_job_id,_selected_user_id);
                                        if((rows != null) && (rows.isValidRow())){
                                                if(rows.fieldByName(_type+'_operation_log_type_code') === 1){
                                                        action = "stop";//end by stop                                                                
                                                }else{
                                                        action = "start";
                                                }
                                        }   
                                        rows.close();
                                        db.close();
                                        if(action === 'start'){
                                                Ti.App.fireEvent('closeTimer');                                                                   
                                        }                                                 
                                }                                
                                                                
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        self.close_all_window_and_return_to_menu(); 
                                }else{                                                                
                                        win.close();
                                }
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
                 *  override table_view_click_event  function of parent class: fieldteam.js
                 */                  
                self.table_view_click_event = function(e){
                        try{
                                _current_selected_row = e.row;
                                switch(e.row.filter_class){
                                        case 'set_job_id_after_accepted_quote':
                                                _event_for_quote_accepted(e);
                                                break;
                                        case 'set_client':
                                                _event_for_set_client(e);
                                                break;
                                        case 'set_address':
                                                _event_for_set_job_address(e);
                                                break;
                                        case 'set_order_source_code':
                                                _event_for_set_order_source_code(e);
                                                break;
                                        case 'set_job_priority':
                                                _event_for_set_job_priority(e);
                                                break;
                                        case 'set_job_status':
                                                _event_for_set_job_status(e);
                                                break;
                                        case 'set_job_due':
                                                _event_for_set_job_due(e);
                                                break;                                                
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.table_view_click_event');
                                return;
                        }                          
                };
                /**
                 *  update field value after set properties 
                 *  in focus event call it
                 */
                self.update_field_value_after_set_properites = function(){
                        try{
                                if(Ti.App.Properties.getBool('select_client_flag')){
                                        _client_id = Ti.App.Properties.getString('select_client_flag_client_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.client_id = _client_id;
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = Ti.App.Properties.getString('select_client_flag_client_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                _current_selected_row.height = 'auto';
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('select_client_flag',false);
                                        
                                        //set job address if select client address as job address
                                        if(Ti.App.Properties.getBool('edit_address_flag_in_select_client_flag')){      
                                                _sub_number = self.trim(Ti.App.Properties.getString('edit_address_sub_number'));
                                                _unit_number = self.trim(Ti.App.Properties.getString('edit_address_unit_number'));
                                                _street_number = self.trim(Ti.App.Properties.getString('edit_address_street_number'));
                                                _street = self.trim(Ti.App.Properties.getString('edit_address_street'));
                                                _street_type = self.trim(Ti.App.Properties.getString('edit_address_street_type'));
                                                _suburb = self.trim(Ti.App.Properties.getString('edit_address_suburb'));
                                                _postcode = self.trim(Ti.App.Properties.getString('edit_address_postcode'));
                                                _state_id = Ti.App.Properties.getString('edit_address_stateID');
                                                _state = Ti.App.Properties.getString('edit_address_state');
                                                _street_type_id = Ti.App.Properties.getString('edit_address_street_type_id');
                                                _suburb_id = Ti.App.Properties.getString('edit_address_suburb_id');  
                                                _latitudeText = Ti.App.Properties.getString('edit_address_latitudeText');
                                                _longitudeText = Ti.App.Properties.getString('edit_address_longitudeText');                                         
                                                _address_row.sub_number = _sub_number;
                                                _address_row.unit_number = _unit_number;
                                                _address_row.street_number = _street_number;
                                                _address_row.street = _street;
                                                _address_row.street_type = _street_type;
                                                _address_row.suburb = _suburb;
                                                _address_row.postcode = _postcode;
                                                _address_row.state = _state;
                                                _address_row.state_id = _state_id;
                                                _address_row.street_type_id = _street_type_id;
                                                _address_row.suburb_id = _suburb_id;
                                                var address = (_unit_number === null)?'':_unit_number;
                                                if(address != ''){
                                                        address+= (_sub_number === null)?'/':'-'+_sub_number+'/';
                                                }
                                                address += _street_number+' '+self.display_correct_street(_street,_street_type)+'\n'+_suburb+(_postcode !=''?' '+_postcode:'');
                                                if(_state != ''){
                                                        address += '\n'+_state;
                                                }
                                                _address_row.children[_address_row.children.length-1].text = address;
                                                if((address === '')||(address === null)){
                                                        _address_row.children[_address_row.children.length-1].visible = false;
                                                        _address_row.children[_address_row.children.length-2].visible = true;
                                                }else{
                                                        _address_row.children[_address_row.children.length-1].visible = true;
                                                        _address_row.children[_address_row.children.length-2].visible = false;
                                                }
                                                _address_row.height = 'auto';
                                                Ti.App.Properties.setBool('edit_address_flag_in_select_client_flag',false);
                                        }                                                                                
                                }                                  
                                if(Ti.App.Properties.getBool('update_job_status_code_flag')){
                                        _job_status_code_hide_id_value = Ti.App.Properties.getString('update_job_status_code_value');
                                        _status_reason = Ti.App.Properties.getString('update_job_status_code_reason');
                                        if(_current_selected_row != null){
                                                var status_content = '';
                                                var db = Titanium.Database.open(self.get_db_name());
                                                var row = db.execute('SELECT * FROM my_'+_type+'_status_code WHERE code=?',_job_status_code_hide_id_value);
                                                if((row.getRowCount() > 0)&&(row.isValidRow())){
                                                        status_content = row.fieldByName('name');                                                                
                                                }
                                                row.close();
                                                db.close();
                                                _current_selected_row.job_status_code = _job_status_code_hide_id_value;
                                                _current_selected_row.job_status_name = status_content;
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = status_content;
                                                if((status_content === '')||(status_content === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_job_status_code_flag',false);
                                }  
                                if(Ti.App.Properties.getBool('update_unique_code_job_prority_view_flag')){
                                        _job_priority_code_hide_id_value = Ti.App.Properties.getString('update_unique_code_job_prority_view_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.job_priority_code = _job_priority_code_hide_id_value;
                                                _current_selected_row.job_priority_name = Ti.App.Properties.getString('update_unique_code_job_prority_view_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _current_selected_row.job_priority_name;
                                                if((_current_selected_row.job_priority_name === '')||(_current_selected_row.job_priority_name === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_unique_code_job_prority_view_flag',false);
                                }   
                                
                                if(Ti.App.Properties.getBool('update_unique_code_order_source_code_view_flag')){
                                        _order_source_code = Ti.App.Properties.getString('update_unique_code_order_source_code_view_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.order_source_code = _order_source_code;
                                                _current_selected_row.order_source_code_name = Ti.App.Properties.getString('update_unique_code_order_source_code_view_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _current_selected_row.order_source_code_name;
                                                if((_current_selected_row.order_source_code_name === '')||(_current_selected_row.order_source_code_name === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_unique_code_order_source_code_view_flag',false);
                                }             
                                
                                if(Ti.App.Properties.getBool('update_job_date_and_time_job_due_view_flag')){
                                        _due = Ti.App.Properties.getString('update_job_date_and_time_job_due_view_content');
                                        if(_current_selected_row != null){
                                                if(_due=== null){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].text = 'N/A';
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].text = self.display_time_and_date(self.get_seconds_value_by_time_string(_due));
                                                }
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;                                                        
                                        }      
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('update_job_date_and_time_job_due_view_flag',false);
                                }                                  

                                if(Ti.App.Properties.getBool('edit_address_flag')){      
                                        _sub_number = self.trim(Ti.App.Properties.getString('edit_address_sub_number'));
                                        _unit_number = self.trim(Ti.App.Properties.getString('edit_address_unit_number'));
                                        _street_number = self.trim(Ti.App.Properties.getString('edit_address_street_number'));
                                        _street = self.trim(Ti.App.Properties.getString('edit_address_street'));
                                        _street_type = self.trim(Ti.App.Properties.getString('edit_address_street_type'));
                                        _suburb = self.trim(Ti.App.Properties.getString('edit_address_suburb'));
                                        _postcode = self.trim(Ti.App.Properties.getString('edit_address_postcode'));
                                        _state_id = Ti.App.Properties.getString('edit_address_stateID');
                                        _state = Ti.App.Properties.getString('edit_address_state');
                                        _street_type_id = Ti.App.Properties.getString('edit_address_street_type_id');
                                        _suburb_id = Ti.App.Properties.getString('edit_address_suburb_id');  
                                        _latitudeText = Ti.App.Properties.getString('edit_address_latitudeText');
                                        _longitudeText = Ti.App.Properties.getString('edit_address_longitudeText');                                         
                                        _current_selected_row.sub_number = _sub_number;
                                        _current_selected_row.unit_number = _unit_number;
                                        _current_selected_row.street_number = _street_number;
                                        _current_selected_row.street = _street;
                                        _current_selected_row.street_type = _street_type;
                                        _current_selected_row.suburb = _suburb;
                                        _current_selected_row.postcode = _postcode;
                                        _current_selected_row.state = _state;
                                        _current_selected_row.state_id = _state_id;
                                        _current_selected_row.street_type_id = _street_type_id;
                                        _current_selected_row.suburb_id = _suburb_id;
                                        address = (_unit_number === null)?'':_unit_number;
                                        if(address != ''){
                                                address+= (_sub_number === null)?'/':'-'+_sub_number+'/';
                                        }
                                        address += _street_number+' '+self.display_correct_street(_street,_street_type)+'\n'+_suburb+(_postcode !=''?' '+_postcode:'');
                                        if(_state != ''){
                                                address += '\n'+_state;
                                        }
                                        _current_selected_row.children[_current_selected_row.children.length-1].text = address;
                                        if((address === '')||(address === null)){
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                        }else{
                                                _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                        }
                                        _current_selected_row.height = 'auto';
                                        _is_make_changed = true;
                                        Ti.App.Properties.setBool('edit_address_flag',false);
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };

                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_reference_number = win.job_reference_number;
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _action_for_job = win.action_for_job;

                var _client_id = 0;
                var _job_priority_code_hide_id_value = 0;
                var _job_title = '';
                var _old_job_status_code_hide_id_value = 0;
                var _job_status_code_hide_id_value=0;
                var _order_reference = '';
                var _site_or_sp_name = '';
                var _allocated_hours = 0;
                var _sub_number = null;
                var _unit_number = null;
                var _street_number = null;
                var _street = null;
                var _street_type_id = 0;
                var _street_type = '';
                var _suburb = '';
                var _postcode = '';
                var _suburb_id = 0;
                var _state = '';
                var _state_id = 0;
                var _latitudeText = '';
                var _longitudeText = '';
                var _descriptionText = null;
                var _bookingNoteText = null;
                var _job_id_after_accepted_quote = 0;
                var _due = '';
                var _order_source_code=0;
                var _created = null;
                var _modified = null;
                var _current_field_num=0;
                var _current_selected_row = null;
                var _status_reason = '';
                var _is_make_changed = false;
                var _address_row = null;
                var _selected_field_object = null;

                //private method

                /**
                 *  init job id field
                 */
                function _init_job_id_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;
                                var job_id_row = Ti.UI.createTableViewRow({
                                        className:'set_job_id',
                                        job_id:_job_id_after_accepted_quote,
                                        filter_class:'set_job_id_after_accepted_quote',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter strata plan.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var job_id__after_accepted_quote_title_field = Ti.UI.createLabel({
                                        text:'Job No.',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                job_id_row.add(job_id__after_accepted_quote_title_field);
                                                                
                                var job_id__after_accepted_quote_value_field = Ti.UI.createLabel({
                                        text:_job_id_after_accepted_quote,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        right:30,
                                        textAlign:'right'
                                });
                                job_id_row.add(job_id__after_accepted_quote_value_field);
                                                            
                                
                                self.data.push(job_id_row);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_id_field');
                                return;
                        }                                
                }
                /**
                 *  init client field
                 */                
                function _init_client_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;
                                var client_name = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var selected_client_obj = db.execute('SELECT * FROM my_client WHERE id=?',_client_id);
                                if((selected_client_obj.getRowCount() > 0)&&(selected_client_obj.isValidRow())){
                                        client_name = selected_client_obj.fieldByName('client_name');
                                }
                                selected_client_obj.close();
                                db.close();
                                var clientField = Ti.UI.createTableViewRow({
                                        className:'set_client',
                                        client_id:_client_id,
                                        filter_class:'set_client',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please select client.',//for check value
                                        hasChild:true,
                                        height:((client_name === '')||(client_name === null))?self.default_table_view_row_height:'auto'
                                });
                                var clientTitleField = Ti.UI.createLabel({
                                        text:'Client',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                clientField.add(clientTitleField);
                                                                

                                var clientContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(clientTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                clientField.add(clientContentRequiredTextLabel);
                                                                

                                var clientContentField = Ti.UI.createLabel({
                                        right:10,
                                        height:((client_name === '')||(client_name === null))?self.default_table_view_row_height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(clientTitleField.text),
                                        textAlign:'right',
                                        text:client_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                clientField.add(clientContentField);
                                                             
                                
                                if((client_name === '')||(client_name === null)){
                                        clientContentField.visible = false;
                                }else{
                                        clientContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(clientField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_client_field');
                                return;
                        }                                
                }
                /**
                 *  init address field
                 */                
                function _init_address_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;                                
                                var address = '';
                                address = (_unit_number === null)?'':_unit_number;
                                if(address != ''){
                                        address+= (_sub_number === null)?'':'-'+_sub_number+'/';
                                }
                                if(self.is_ipad()){
                                        if(_street_number != ''){
                                                address += _street_number+' '+_street+', '+_suburb+(_postcode !=''?' '+_postcode:'');
                                                if(_state != null){
                                                        address += ', '+_state;
                                                }
                                        }
                                }else{
                                        if(_street_number != ''){
                                                address += _street_number+' '+_street+'\n'+_suburb+(_postcode !=''?' '+_postcode:'');
                                                if(_state != null){
                                                        address += '\n'+_state;
                                                }
                                        }
                                }
                                address = self.trim(address);
                                var addressField = Ti.UI.createTableViewRow({
                                        className:'set_address',
                                        sub_number:_sub_number,
                                        unit_number:_unit_number,
                                        street_number:_street_number,
                                        street:_street,
                                        street_type:_street_type,
                                        suburb:_suburb,
                                        postcode:_postcode,
                                        state:_state,
                                        state_id:_state_id,
                                        street_type_id:_street_type_id,
                                        suburb_id:_suburb_id,
                                        hasChild:true,
                                        filter_class:'set_address',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please enter address.',//for check value
                                        height:((address === '')||(address === null))?self.default_table_view_row_height:'auto'
                                });
                                var addressTitleField = Ti.UI.createLabel({
                                        text:'Address',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                addressField.add(addressTitleField);
                                                              

                                var addressContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(addressTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                addressField.add(addressContentRequiredTextLabel);                                    

                                var addressContentField = Ti.UI.createLabel({
                                        top:5,
                                        bottom:5,
                                        right:10,
                                        height:((address === '')||(address === null))?self.default_table_view_row_height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(addressTitleField.text),
                                        textAlign:'right',
                                        text:address,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                addressField.add(addressContentField);
                                                               
                                
                                if((address === '')||(address === null)){
                                        addressContentField.visible = false;
                                }else{
                                        addressContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(addressField);
                                _address_row = addressField;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_address_field');
                                return;
                        }                                
                }
                /**
                 *  init job order source field
                 */                
                function _init_order_source_code_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;                                
                                var order_source_code_name = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var selected_order_source_code_obj = db.execute('SELECT * FROM my_order_source_code WHERE code=?',_order_source_code);
                                if((selected_order_source_code_obj.getRowCount() > 0) && (selected_order_source_code_obj.isValidRow())){
                                        order_source_code_name = selected_order_source_code_obj.fieldByName('name');
                                        order_source_code_name = ((order_source_code_name === '')||(order_source_code_name === null))?'':order_source_code_name;
                                }
                                selected_order_source_code_obj.close();
                                db.close();
                                var jobOrderSourceCodeField = Ti.UI.createTableViewRow({
                                        className:'set_order_source_code',
                                        order_source_code:_order_source_code,
                                        order_source_code_name:order_source_code_name,
                                        filter_class:'set_order_source_code',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please select order source.',//for check value
                                        hasChild:true,
                                        height:((order_source_code_name === '')||(order_source_code_name === null))?self.default_table_view_row_height:'auto'
                                });
                                var jobOrderSourceCodeTitleField = Ti.UI.createLabel({
                                        text:(self.is_ipad())?'Order Source':'Order \nSource',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobOrderSourceCodeField.add(jobOrderSourceCodeTitleField);                                 
                                

                                var jobOrderSourceCodeContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(jobOrderSourceCodeTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobOrderSourceCodeField.add(jobOrderSourceCodeContentRequiredTextLabel);
                                                                 

                                var jobOrderSourceCodeContentField = Ti.UI.createLabel({
                                        right:10,
                                        height:((order_source_code_name === '')||(order_source_code_name === null))?self.default_table_view_row_height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(jobOrderSourceCodeTitleField.text),
                                        textAlign:'right',
                                        text:order_source_code_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobOrderSourceCodeField.add(jobOrderSourceCodeContentField);
                                                               
                                
                                if((order_source_code_name === '')||(order_source_code_name === null)){
                                        jobOrderSourceCodeContentField.visible = false;
                                }else{
                                        jobOrderSourceCodeContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(jobOrderSourceCodeField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_order_source_code_field');
                                return;
                        }                                
                }                
                /**
                 *  init order reference field
                 */                
                function _init_order_reference_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;
                                var is_required_field = false;                                
                                var jobOrderReferenceField = Ti.UI.createTableViewRow({
                                        className:'set_job_order_reference',
                                        job_order_reference:_order_reference,
                                        filter_class:'set_job_order_reference',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter order reference.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var jobOrderReferenceTitleField = Ti.UI.createLabel({
                                        text:(self.is_ipad())?'Order Reference':'Order \nReference',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobOrderReferenceField.add(jobOrderReferenceTitleField);                                

                                self.jobOrderReferenceContentField = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(jobOrderReferenceTitleField.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_order_reference,
                                        enabled:true,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                jobOrderReferenceField.add(self.jobOrderReferenceContentField);                                
                                
                                self.data.push(jobOrderReferenceField);
                                self.jobOrderReferenceContentField.addEventListener('change',function(e){
                                        _is_make_changed = true;
                                        _order_reference = e.value;
                                });
                                self.jobOrderReferenceContentField.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });                 
                                
                                self.jobOrderReferenceContentField.addEventListener('focus',function(e){                                        
                                        _selected_field_object = e.source;
                                });
                                self.jobOrderReferenceContentField.addEventListener('blur',function(e){
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_order_reference_field');
                                return;
                        }                                
                }
                /**
                 *  init strata plan field
                 */                
                function _init_strata_plan_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;
                                var is_required_field = false;                                
                                var jobStrataPlanField = Ti.UI.createTableViewRow({
                                        className:'set_job_sp',
                                        job_sp:_site_or_sp_name,
                                        filter_class:'set_job_sp',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter strata plan.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var jobStrataPlanTitleField = Ti.UI.createLabel({
                                        text:'Strata Plan',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobStrataPlanField.add(jobStrataPlanTitleField);                     
                                
                                self.jobStrataPlanContentField = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(jobStrataPlanTitleField.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_site_or_sp_name,
                                        enabled:true,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                jobStrataPlanField.add(self.jobStrataPlanContentField);                                    
                                
                                
                                self.data.push(jobStrataPlanField);
                                self.jobStrataPlanContentField.addEventListener('change',function(e){
                                        _site_or_sp_name = e.value;
                                        _is_make_changed = true;
                                });
                                self.jobStrataPlanContentField.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                }); 
                                
                                self.jobStrataPlanContentField.addEventListener('focus',function(e){                                        
                                        _selected_field_object = e.source;
                                });
                                self.jobStrataPlanContentField.addEventListener('blur',function(e){
                                        _selected_field_object = null;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_strata_plan_field');
                                return;
                        }                                
                }
                /**
                 *  init job title field
                 */                
                function _init_job_title_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;                                
                                var jobTitleField = Ti.UI.createTableViewRow({
                                        className:'set_job_title',
                                        job_title:_job_title,
                                        filter_class:'set_job_title',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'Please enter title.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var jobTitleTitleField = Ti.UI.createLabel({
                                        text:'Title',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobTitleField.add(jobTitleTitleField);                            
                                
                                self.jobTitleContentField = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(jobTitleTitleField.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_job_title,
                                        enabled:true,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                jobTitleField.add(self.jobTitleContentField);                                  
                                
                                self.data.push(jobTitleField);
                                self.jobTitleContentField.addEventListener('change',function(e){
                                        _job_title = e.value;
                                        _is_make_changed = true;
                                });
                                
                                self.jobTitleContentField.addEventListener('focus',function(e){                                        
                                        _selected_field_object = e.source;
                                });
                                self.jobTitleContentField.addEventListener('blur',function(e){
                                        _selected_field_object = null;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_title_field');
                                return;
                        }                                
                }
                /**
                 *  init job priority field
                 */                
                function _init_job_priority_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;                                
                                var priority_name = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var selected_priority_obj = db.execute('SELECT * FROM my_'+_type+'_priority_code WHERE code=?',_job_priority_code_hide_id_value);
                                if((selected_priority_obj.getRowCount() > 0) && (selected_priority_obj.isValidRow())){
                                        priority_name = selected_priority_obj.fieldByName('name');
                                        priority_name = ((priority_name === '')||(priority_name === null))?'':priority_name;
                                }
                                selected_priority_obj.close();
                                db.close();
                                var jobPriorityField = Ti.UI.createTableViewRow({
                                        className:'set_job_priority',
                                        job_priority_code:_job_priority_code_hide_id_value,
                                        job_priority_name:priority_name,
                                        filter_class:'set_job_priority',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please select priority.',//for check value
                                        hasChild:true,
                                        height:((priority_name === '')||(priority_name === null))?self.default_table_view_row_height:'auto'
                                });
                                var jobPriorityTitleField = Ti.UI.createLabel({
                                        text:'Priority',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobPriorityField.add(jobPriorityTitleField);                               

                                var jobPriorityContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(jobPriorityTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobPriorityField.add(jobPriorityContentRequiredTextLabel);                                

                                var jobPriorityContentField = Ti.UI.createLabel({
                                        right:10,
                                        height:((priority_name === '')||(priority_name === null))?self.default_table_view_row_height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(jobPriorityTitleField.text),
                                        textAlign:'right',
                                        text:priority_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobPriorityField.add(jobPriorityContentField);                             
                                
                                if((priority_name === '')||(priority_name === null)){
                                        jobPriorityContentField.visible = false;
                                }else{
                                        jobPriorityContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(jobPriorityField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_priority_field');
                                return;
                        }                                
                }
                /**
                 *  init job status field
                 */                
                function _init_job_status_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;                                
                                var job_status_name = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var selected_job_status_code_obj = db.execute('SELECT * FROM my_'+_type+'_status_code WHERE code=?',_job_status_code_hide_id_value);
                                if((selected_job_status_code_obj.getRowCount() > 0) && (selected_job_status_code_obj.isValidRow())){
                                        job_status_name = selected_job_status_code_obj.fieldByName('name');
                                        job_status_name = ((job_status_name === '')||(job_status_name === null))?'':job_status_name;
                                }
                                selected_job_status_code_obj.close();
                                db.close();
                                var jobStatusField = Ti.UI.createTableViewRow({
                                        className:'set_job_status',
                                        job_status_code:_job_status_code_hide_id_value,
                                        job_status_name:job_status_name,
                                        filter_class:'set_job_status',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please select status.',//for check value
                                        hasChild:true,
                                        height:((job_status_name === '')||(job_status_name === null))?self.default_table_view_row_height:'auto'
                                });
                                var jobStatusTitleField = Ti.UI.createLabel({
                                        text:'Status',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobStatusField.add(jobStatusTitleField);                                  

                                var jobStatusContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(jobStatusTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobStatusField.add(jobStatusContentRequiredTextLabel);                                  

                                var jobStatusContentField = Ti.UI.createLabel({
                                        right:10,
                                        height:((job_status_name === '')||(job_status_name === null))?self.default_table_view_row_height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(jobStatusTitleField.text),
                                        textAlign:'right',
                                        text:job_status_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobStatusField.add(jobStatusContentField);                                  
                                
                                if((job_status_name === '')||(job_status_name === null)){
                                        jobStatusContentField.visible = false;
                                }else{
                                        jobStatusContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(jobStatusField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_status_field');
                                return;
                        }                                
                }
                /**
                 *  init due field
                 */                
                function _init_job_due_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false; 
                                var due_Field = Ti.UI.createTableViewRow({
                                        className:'set_job_due',
                                        filter_class:'set_job_due',
                                        due:_due,
                                        hasChild:true,
                                        height:self.default_table_view_row_height
                                });
                                var dueTitleField = Ti.UI.createLabel({
                                        text:'Due On',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                due_Field.add(dueTitleField);                                       

                                var dueContentRequiredTextLabel = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(dueTitleField.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                due_Field.add(dueContentRequiredTextLabel);                                     

                                var dueContentField = Ti.UI.createLabel({
                                        right:10,
                                        width:self.set_a_field_width_in_table_view_row(dueTitleField.text),
                                        textAlign:'right',
                                        text:((_due === undefined)||(_due === null) || (_due === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(_due)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                due_Field.add(dueContentField);                               
                                
                                if((_due === undefined)||(_due === null)||(_due === '')){
                                        dueContentField.visible = false;
                                }else{
                                        dueContentRequiredTextLabel.visible = false;
                                }
                                self.data.push(due_Field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_due_field');
                                return; 
                        }                                  
                }                
                /**
                 *  init job create field
                 */                 
                function _init_job_created_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;                                
                                var jobCreatedField = Ti.UI.createTableViewRow({
                                        className:'set_job_created',
                                        filter_class:'set_job_created',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var jobCreatedTitleField = Ti.UI.createLabel({
                                        text:'Created',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobCreatedField.add(jobCreatedTitleField);                                
                                
                                self.jobCreatedContentField = Ti.UI.createLabel({
                                        right:30,
                                        width:self.set_a_field_width_in_table_view_row(jobCreatedTitleField.text),
                                        textAlign:'right',
                                        text:((_created === undefined) ||(_created === null) || (_created === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(_created)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobCreatedField.add(self.jobCreatedContentField);                                   
                                
                                self.data.push(jobCreatedField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_created_field');
                                return;
                        }
                }
                /**
                 *  init job modified field
                 */                 
                function _init_job_modified_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;                                
                                var jobModifiedField = Ti.UI.createTableViewRow({
                                        className:'set_job_modified',
                                        filter_class:'set_job_modified',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value
                                        valuePrompt:'',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var jobModifiedTitleField = Ti.UI.createLabel({
                                        text:'Modified',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                jobModifiedField.add(jobModifiedTitleField);                                
                                
                                self.jobModifiedContentField = Ti.UI.createLabel({
                                        right:30,
                                        width:self.set_a_field_width_in_table_view_row(jobModifiedTitleField.text),
                                        textAlign:'right',
                                        text:((_modified === undefined) ||(_modified === null) || (_modified === ''))?'N/A':self.display_time_and_date(self.get_seconds_value_by_time_string(_modified)),
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                jobModifiedField.add(self.jobModifiedContentField);                                  
                                
                                self.data.push(jobModifiedField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_job_modified_field');
                                return;
                        }
                }                  
                /**
                 *  set client event
                 */                
                function _event_for_set_client(e){
                        try{
                                var client_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','client/select_client.js'),
                                        client_id:e.row.client_id,
                                        is_save_directly:false,
                                        job_id:_selected_job_id,
                                        job_reference_number:_selected_job_reference_number,
                                        job_type:_type
                                });
                                Titanium.UI.currentTab.open(client_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_set_client');
                                return;
                        }                                
                }
                /**
                 *  set job address event
                 */                
                function _event_for_set_job_address(e){
                        try{
                                var address_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','base/edit_address.js'),
                                        sub_number:e.row.sub_number,
                                        unit_number:e.row.unit_number,
                                        street_number:e.row.street_number,
                                        street:e.row.street,
                                        street_type:e.row.street_type,
                                        suburb:e.row.suburb,
                                        postcode:e.row.postcode,
                                        state:e.row.state,
                                        stateID:e.row.state_id,
                                        street_type_id:e.row.street_type_id,
                                        suburb_id:e.row.suburb_id
                                });
                                Titanium.UI.currentTab.open(address_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_set_job_address');
                                return;
                        }                                
                }
                /**
                 * set order source code
                 */
                function _event_for_set_order_source_code(e){
                        try{
                                var order_source_code_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','base/select_unique_code_from_table_view.js'),
                                        win_title:'Select Order Source',
                                        table_name:'my_order_source_code',//table name
                                        display_name:'name',//need to shwo field
                                        content:e.row.order_source_code,
                                        content_value:e.row.order_source_code_name,
                                        source:'order_source_code'
                                });
                                Titanium.UI.currentTab.open(order_source_code_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_set_order_source_code');
                                return;
                        }                           
                }
                /**
                 *  set job priority event
                 */                
                function _event_for_set_job_priority(e){
                        try{
                                var job_priority_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','base/select_unique_code_from_table_view.js'),
                                        win_title:'Select '+self.ucfirst(_type)+' Priority',
                                        table_name:'my_'+_type+'_priority_code',//table name
                                        display_name:'name',//need to shwo field
                                        content:e.row.job_priority_code,
                                        content_value:e.row.job_priority_name,
                                        source:'job_prority'
                                });
                                Titanium.UI.currentTab.open(job_priority_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_set_job_priority');
                                return;
                        }                                
                }
                /**
                 *  set job status event
                 */                
                function _event_for_set_job_status(e){
                        try{
                                var job_status_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url','job/base/job_select_status.js'),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        job_status_code:e.row.job_status_code,
                                        source:'from_job_detail'
                                });
                                Titanium.UI.currentTab.open(job_status_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_set_job_status');
                                return;
                        }                                
                }  
                /**
                 *  event when click assigned user
                 */
                function _event_for_set_job_due(e){
                        try{
                                var new_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'job/base/job_date_and_time.js'),
                                        content:self.get_seconds_value_by_time_string(_due),
                                        type:_type,
                                        job_id:_selected_job_id,
                                        scheduled_time_type:'due',
                                        source:'job_due'                                        
                                });
                                Titanium.UI.currentTab.open(new_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_set_job_due');
                                return; 
                        }                                   
                }                
                /**
                 *  check if exist any change
                 */
                function _check_if_exist_change(){
                        try{
                                var is_make_changed = false;


                                if(_is_make_changed){
                                        is_make_changed = true;
                                }else{
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_'+_type+' WHERE status_code=1 and company_id=? and id=?',_selected_company_id,_selected_job_id);                                        
                                        if(rows.isValidRow()){
                                                if((!is_make_changed)&&(_client_id != rows.fieldByName('client_id'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_sub_number != rows.fieldByName('sub_number'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_unit_number != rows.fieldByName('unit_number'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_street_number != rows.fieldByName('street_number'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_street != rows.fieldByName('street'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_street_type_id != rows.fieldByName('locality_street_type_id'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_street_type != rows.fieldByName('street_type'))){
                                                        is_make_changed = true;
                                                }                                        
                                                if((!is_make_changed)&&(_suburb_id != rows.fieldByName('locality_suburb_id'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_suburb != rows.fieldByName('suburb'))){
                                                        is_make_changed = true;
                                                }        
                                                if((!is_make_changed)&&(_postcode != rows.fieldByName('postcode'))){
                                                        is_make_changed = true;
                                                }                                                       
                                                if((!is_make_changed)&&(_state_id != rows.fieldByName('locality_state_id'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_order_source_code != rows.fieldByName('order_source_code'))){
                                                        is_make_changed = true;
                                                }                                                
                                                if((!is_make_changed)&&(_order_reference != rows.fieldByName('order_reference'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_site_or_sp_name != rows.fieldByName('sp'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_job_status_code_hide_id_value != rows.fieldByName(_type+'_status_code'))){
                                                        is_make_changed = true;
                                                }
                                                if((!is_make_changed)&&(_due != rows.fieldByName('due'))){
                                                        is_make_changed = true;
                                                }                                                
                                                if((!is_make_changed)&&(_job_title != rows.fieldByName('title'))){
                                                        is_make_changed = true;
                                                }
                                                if(_type === 'job'){
                                                        if((!is_make_changed)&&(_job_priority_code_hide_id_value != rows.fieldByName(_type+'_priority_code'))){
                                                                is_make_changed = true;
                                                        }
                                                }    
                                        }
                                        db.close();
                                }
                                
                                return is_make_changed;
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_exist_change');
                                return false; 
                        }   
                }                    
                //update record
                function _update_job_table(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('UPDATE my_job SET client_id=?,job_priority_code=?,job_status_code=?,scheduled_from=?,'+
                                        'scheduled_to=?,order_reference=?,sp=?,sub_number=?,unit_number=?,street_number=?,street=?,locality_street_type_id=?,street_type=?,'+
                                        'locality_suburb_id=?,suburb=?,postcode=?,locality_state_id=?,latitude=?,longitude=?,'+
                                        'title=?,description=?,booking_note=?,allocated_hours=?,due=?,order_source_code=?,changed=?,exist_any_changed=?,modified_by=?,modified=? WHERE id='+_selected_job_id,
                                        _client_id,
                                        _job_priority_code_hide_id_value,
                                        _job_status_code_hide_id_value,
                                        null,
                                        null,
                                        _order_reference,
                                        _site_or_sp_name,
                                        _sub_number,
                                        _unit_number,
                                        _street_number,
                                        ((_street !=undefined) && (_street != null) && (self.trim(_street) != ''))?_street.toUpperCase():'',
                                        _street_type_id,
                                        ((_street_type !=undefined) && (_street_type != null) && (self.trim(_street_type) != ''))?_street_type.toUpperCase():'',
                                        _suburb_id,
                                        ((_suburb !=undefined) && (_suburb != null) && (self.trim(_suburb) != ''))?_suburb.toUpperCase():'',
                                        ((_postcode !=undefined) && (_postcode != null) && (self.trim(_postcode) != ''))?_postcode.toUpperCase():'',
                                        _state_id,
                                        _latitudeText,
                                        _longitudeText,
                                        _job_title,
                                        _descriptionText,
                                        _bookingNoteText,
                                        _allocated_hours,
                                        _due,
                                        _order_source_code,
                                        1,1,
                                        _selected_user_id,
                                        null
                                        );
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_job_table');
                                return;
                        }                                
                }
                //update record
                function _update_quote_table(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('UPDATE my_quote SET client_id=?,quote_status_code=?,scheduled_from=?,'+
                                        'scheduled_to=?,order_reference=?,sp=?,sub_number=?,unit_number=?,street_number=?,street=?,locality_street_type_id=?,street_type=?,'+
                                        'locality_suburb_id=?,suburb=?,postcode=?,locality_state_id=?,latitude=?,longitude=?,'+
                                        'title=?,description=?,booking_note=?,allocated_hours=?,due=?,order_source_code=?,changed=?,exist_any_changed=?,modified_by=?,modified=? WHERE id='+_selected_job_id,
                                        _client_id,
                                        _job_status_code_hide_id_value,
                                        null,
                                        null,
                                        _order_reference,
                                        _site_or_sp_name,
                                        _sub_number,
                                        _unit_number,
                                        _street_number,
                                        ((_street !=undefined) && (_street != null) && (self.trim(_street) != ''))?_street.toUpperCase():'',
                                        _street_type_id,
                                        ((_street_type !=undefined) && (_street_type != null) && (self.trim(_street_type) != ''))?_street_type.toUpperCase():'',
                                        _suburb_id,
                                        ((_suburb !=undefined) && (_suburb != null) && (self.trim(_suburb) != ''))?_suburb.toUpperCase():'',
                                        ((_postcode !=undefined) && (_postcode != null) && (self.trim(_postcode) != ''))?_postcode.toUpperCase():'',
                                        _state_id,
                                        _latitudeText,
                                        _longitudeText,
                                        _job_title,
                                        _descriptionText,
                                        _bookingNoteText,
                                        _allocated_hours,
                                        _due,
                                        _order_source_code,
                                        1,1,
                                        _selected_user_id,
                                        null
                                        ); 
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _update_quote_table');
                                return;
                        }                                
                }
                //add new record
                function _insert_into_job_table(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('INSERT INTO my_job (id,local_id,company_id,client_id,job_priority_code,job_status_code,scheduled_from,'+
                                        'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,'+
                                        'locality_suburb_id,suburb,postcode,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'+
                                        'title,description,booking_note,allocated_hours,status_code,due,order_source_code,is_task,changed,exist_any_changed,created,created_by,modified_by,modified)'+
                                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                        _selected_job_id,
                                        _selected_company_id+'-'+_selected_user_id+'-'+_selected_job_id,
                                        _selected_company_id,
                                        _client_id,
                                        _job_priority_code_hide_id_value,
                                        _job_status_code_hide_id_value,
                                        null,
                                        null,
                                        _selected_job_reference_number,
                                        _order_reference,
                                        _site_or_sp_name,
                                        _sub_number,
                                        _unit_number,
                                        _street_number,
                                        ((_street !=undefined) && (_street != null) && (self.trim(_street) != ''))?_street.toUpperCase():'',
                                        _street_type_id,
                                        ((_street_type !=undefined) && (_street_type != null) && (self.trim(_street_type) != ''))?_street_type.toUpperCase():'',
                                        _suburb_id,
                                        ((_suburb !=undefined) && (_suburb != null) && (self.trim(_suburb) != ''))?_suburb.toUpperCase():'',
                                        ((_postcode !=undefined) && (_postcode != null) && (self.trim(_postcode) != ''))?_postcode.toUpperCase():'',
                                        _state_id,
                                        _latitudeText,
                                        _longitudeText,
                                        null,
                                        null,
                                        null,
                                        null,
                                        _job_title,
                                        _descriptionText,
                                        _bookingNoteText,
                                        _allocated_hours,
                                        1,
                                        _due,
                                        _order_source_code,
                                        0,
                                        1,1,
                                        null,
                                        _selected_user_id,
                                        0,
                                        null
                                        );
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _insert_into_job_table');
                                return;
                        }                                
                }
                //add new record
                function _insert_into_quote_table(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('INSERT INTO my_quote (id,local_id,company_id,client_id,quote_status_code,scheduled_from,'+
                                        'scheduled_to,reference_number,order_reference,sp,sub_number,unit_number,street_number,street,locality_street_type_id,street_type,'+
                                        'locality_suburb_id,suburb,postcode,locality_state_id,latitude,longitude,point,boundary,geo_source_code,geo_accuracy_code,'+
                                        'title,description,booking_note,allocated_hours,job_id,status_code,due,order_source_code,is_task,changed,exist_any_changed,created,created_by,modified_by,modified)'+
                                        'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                                        _selected_job_id,
                                        _selected_company_id+'-'+_selected_user_id+'-'+_selected_job_id,
                                        _selected_company_id,
                                        _client_id,
                                        _job_status_code_hide_id_value,
                                        null,
                                        null,
                                        _selected_job_reference_number,
                                        _order_reference,
                                        _site_or_sp_name,
                                        _sub_number,
                                        _unit_number,
                                        _street_number,
                                        ((_street !=undefined) && (_street != null) && (self.trim(_street) != ''))?_street.toUpperCase():'',
                                        _street_type_id,
                                        ((_street_type !=undefined) && (_street_type != null) && (self.trim(_street_type) != ''))?_street_type.toUpperCase():'',
                                        _suburb_id,
                                        ((_suburb !=undefined) && (_suburb != null) && (self.trim(_suburb) != ''))?_suburb.toUpperCase():'',
                                        ((_postcode !=undefined) && (_postcode != null) && (self.trim(_postcode) != ''))?_postcode.toUpperCase():'',
                                        _state_id,
                                        _latitudeText,
                                        _longitudeText,
                                        null,
                                        null,
                                        null,
                                        null,
                                        _job_title,
                                        _descriptionText,
                                        _bookingNoteText,
                                        _allocated_hours,
                                        0,
                                        1,
                                        _due,
                                        _order_source_code,       
                                        0,
                                        1,1,
                                        null,
                                        _selected_user_id,
                                        0,
                                        null
                                        ); 
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _insert_into_quote_table');
                                return;
                        }                                
                }
                
        }

        win.addEventListener('focus',function(){
                try{                        
                        if(job_edit_job_detail_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_edit_job_detail_page.prototype = new F();
                                job_edit_job_detail_page.prototype.constructor = job_edit_job_detail_page;
                                job_edit_job_detail_page_obj = new job_edit_job_detail_page();
                                job_edit_job_detail_page_obj.init();
                        }else{
                                job_edit_job_detail_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }
        });

        win.addEventListener('close',function(){
                try{
                        job_edit_job_detail_page_obj.close_window();
                        job_edit_job_detail_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });    
}());


