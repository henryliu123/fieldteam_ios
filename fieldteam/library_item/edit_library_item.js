/**
 *  Description: library_item editor
 */
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var library_item_edit_library_item_page_obj = null;

        function library_item_edit_library_item_page(){
                var self = this;
                var window_source = 'library_item_edit_library_item_page';
                if(win.action_for_library_item == 'edit_library_item'){
                        win.title = 'Edit Item';
                }else{
                        win.title = 'Add Item';
                }                  

                //public method
                /**
                 *  override init function of parent class: transaction.js
                 */                   
                self.init = function(){
                        try{          
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('Save','Main,Back');
                                self.init_vars();
                                _init_library_item_type_field();
                                _init_library_item_name_field();
                                _init_library_item_abbr_field();
                                _init_library_item_price_field();
                                if(_is_item_management){
                                        _init_library_item_stock_field();
                                }
                                _init_library_item_description_field();                                
                                _init_library_item_gst_field();
                                if(win.action_for_library_item == 'edit_library_item'){
                                        //_init_delete_btn();
                                }
                                //call init_table_view function of parent class: fieldteam.js
                                self.init_table_view();
                                self.table_view.addEventListener('scroll',function(e){
                                        if(_is_library_item_name_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_library_item_abbr_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_library_item_price_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }
                                        if(_is_library_item_stock_field_focused && (_selected_field_object != null)){
                                                _selected_field_object.blur();
                                        }                              
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init');
                                return;
                        }                                
                };
                /**
                 *  override init_vars function of parent class: transaction.js
                 */   
                self.init_vars = function(){
                        try{
                                //check company include gst or not
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_company WHERE id=?',_selected_company_id);
                                if(rows.isValidRow()){
                                        _tax_name = rows.fieldByName('tax');
                                        if(self.trim(_tax_name) == ''){
                                                _tax_name = self.gst_default_name;
                                        }
                                }
                                rows.close();    
                                db.close();
                                
                                if(win.action_for_library_item == 'add_library_item'){
                                        var d= new Date();
                                        _selected_library_item_id = parseInt(d.getTime(),10);
                                }

                                if(win.action_for_library_item == 'edit_library_item'){
                                        db = Titanium.Database.open(self.get_db_name());
                                        var library_itemObj = null;
                                        var sql = '';
                                        if(_is_item_management){
                                                sql = 'SELECT a.*,b.amount as stock FROM my_job_library_item as a '+
                                                'left join my_materials_stocks b on (b.job_library_item_id=a.id and b.status_code=1 and b.materials_locations_id=?) '+
                                                'where a.id=?';
                                                library_itemObj = db.execute(sql,_selected_materials_locations_id,_selected_library_item_id);
                                        }else{
                                                sql = 'SELECT * FROM my_job_library_item WHERE id=?';
                                                library_itemObj = db.execute(sql,_selected_library_item_id);
                                        }                                        
                                        if(library_itemObj.getRowCount() > 0){
                                                if(library_itemObj.isValidRow()){
                                                        _library_item_type_code = library_itemObj.fieldByName('job_library_item_type_code');
                                                        _library_item_name = library_itemObj.fieldByName('item_name');
                                                        _library_item_abbr = library_itemObj.fieldByName('item_abbr');
                                                        _library_item_description = library_itemObj.fieldByName('description');
                                                        if(_is_item_management){
                                                                _library_item_stock = ((library_itemObj.fieldByName('stock') == undefined)||(library_itemObj.fieldByName('stock') == null))?0:library_itemObj.fieldByName('stock');
                                                        }else{
                                                                _library_item_stock = 0;
                                                        }
                                                        _library_item_price = self.currency_formatted(library_itemObj.fieldByName('price'));   
                                                        _library_item_gst = library_itemObj.fieldByName('inc_gst');
                                                }
                                        }
                                        library_itemObj.close();
                                        db.close();
                                }                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }                        
                };
                /**
                 *  override nav_right_btn_click_event function of parent class: transaction.js
                 */                   
                self.nav_right_btn_click_event = function(e){
                        try{
                                _check_if_make_change();
                                if(!_is_make_changed){
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                        return;
                                }
                                if(!Ti.Network.online){
                                        self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                        return;
                                }
                                if(e.index == self.default_main_menu_button_index){//menu menu
                                        _is_click_main_menu_btn = true; 
                                }else{
                                        _is_click_main_menu_btn = false;
                                }                                   
                                _save();
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
                                _check_if_make_change();
                                if(!_is_make_changed){
                                        if(e.index == self.default_main_menu_button_index){//menu menu
                                                self.close_all_window_and_return_to_menu(); 
                                        }else{                                                                
                                                win.close();
                                        }
                                        return;
                                }
                                var option_dialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','Cancel','']:['YES','NO','Cancel'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:2,
                                        title:'Do you want to save this library item?'
                                });
                                option_dialog.show();
                                option_dialog.addEventListener('click',function(evt){
                                        switch(evt.index){
                                                case 0://yes
                                                        self.nav_right_btn_click_event(e);
                                                        break;
                                                case 1://
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
                                _current_selected_row = e.row;
                                switch(e.row.filter_class){
                                        case 'set_library_item_type_code':
                                                _event_for_library_item_type(e);
                                                break;
                                        case 'set_library_item_library_item_description':
                                                _event_for_library_item_description(e);
                                                break;
                                        case 'set_delete_button':
                                                _event_for_delete_btn();
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
                                if(Ti.App.Properties.getBool('update_unique_code_edit_library_item_view_flag')){
                                        _library_item_type_code = Ti.App.Properties.getString('update_unique_code_edit_library_item_view_id');
                                        if(_current_selected_row != null){
                                                _current_selected_row.library_item_type_code = _library_item_type_code;
                                                _current_selected_row.library_item_type_name = Ti.App.Properties.getString('update_unique_code_edit_library_item_view_content');
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _current_selected_row.library_item_type_name;
                                                if((_current_selected_row.library_item_type_name === '')||(_current_selected_row.library_item_type_name === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        Ti.App.Properties.setBool('update_unique_code_edit_library_item_view_flag',false);
                                }     
                                if(Ti.App.Properties.getBool('update_edit_textarea_field_edit_library_item_description_view_flag')){                                         
                                        _library_item_description = Ti.App.Properties.getString('update_edit_textarea_field_edit_library_item_description_view_content');
                                        if(_current_selected_row != null){
                                                _current_selected_row.children[_current_selected_row.children.length-1].text = _library_item_description;
                                                if((_library_item_description === '')||( _library_item_description === null)){
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = false;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = true;
                                                }else{
                                                        _current_selected_row.children[_current_selected_row.children.length-1].visible = true;
                                                        _current_selected_row.children[_current_selected_row.children.length-2].visible = false;
                                                }                                                           
                                        }
                                        Ti.App.Properties.setBool('update_edit_textarea_field_edit_library_item_description_view_flag',false);
                                }                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.update_field_value_after_set_properites');
                                return;
                        }
                };                 

                //private member
                var _selected_user_id = Ti.App.Properties.getString('current_login_user_id');
                var _selected_company_id = Ti.App.Properties.getString('current_company_id');
                var _selected_library_item_id = win.library_item_id;
                var _selected_library_item_reference_number = win.library_item_reference_number;
                var _selected_materials_locations_id = ((Ti.App.Properties.getString('selected_materials_locations_id') == undefined) ||(Ti.App.Properties.getString('selected_materials_locations_id') == null))?0:parseInt(Ti.App.Properties.getString('selected_materials_locations_id'));                
                var _is_item_management = parseInt(Ti.App.Properties.getString('current_company_active_material_location'));
                var _parent_win = (win.parent_win == undefined)?null:win.parent_win;
                var _library_item_type_code = 1;
                var _library_item_name = '';
                var _library_item_abbr = '';
                var _library_item_description = '';
                var _library_item_price = '';
                var _library_item_stock = 0;
                var _library_item_gst = false;
                var _current_field_num = 0;
                var _current_selected_row = null;
                var _is_make_changed = false;
                var _selected_field_object = null;
                var _is_library_item_name_field_focused = false;
                var _is_library_item_abbr_field_focused = false;
                var _is_library_item_price_field_focused = false;
                var _is_library_item_stock_field_focused = false;   
                var _is_click_main_menu_btn = false;
                var _tax_name = '';
                //private method
                /**
                 *  init library item type field
                 */                
                function _init_library_item_type_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = true;
                                var library_item_type_name = '';
                                var db = Titanium.Database.open(self.get_db_name());
                                var rows = db.execute('SELECT * FROM my_job_library_item_type_code WHERE code=?',_library_item_type_code);
                                if(rows.getRowCount() > 0){
                                        if(rows.isValidRow()){
                                                library_item_type_name = rows.fieldByName('name');
                                        }
                                }
                                rows.close();
                                db.close();
                                var library_item_type_code_field = Ti.UI.createTableViewRow({
                                        className:'set_library_item_type_code',
                                        library_item_type_code:_library_item_type_code,
                                        library_item_type_name:library_item_type_name,
                                        filter_class:'set_library_item_type_code',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter type.',//for check value
                                        height:self.default_table_view_row_height,
                                        hasChild:true
                                });
                                var library_item_type_title_field = Ti.UI.createLabel({
                                        text:'Type',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_type_code_field.add(library_item_type_title_field);
                                var library_item_name_content_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(library_item_type_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                library_item_type_code_field.add(library_item_name_content_required_text_label);
                                var library_item_name_content_field = Ti.UI.createLabel({
                                        right:10,
                                        height:((library_item_type_name === '')||(library_item_type_name === null))?self.default_table_view_row_height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(library_item_type_title_field.text),
                                        textAlign:'right',
                                        text:library_item_type_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                library_item_type_code_field.add(library_item_name_content_field);
                                self.data.push(library_item_type_code_field);
                                if((library_item_type_name === '')||(library_item_type_name === null)){
                                        library_item_name_content_field.visible = false;
                                }else{
                                        library_item_name_content_required_text_label.visible = false;
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_type_field');
                                return;
                        }                                
                }
                /**
                 *  init library item name field
                 */                    
                function _init_library_item_name_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;  
                                var is_required_field = true;                                
                                var library_item_name_field = Ti.UI.createTableViewRow({
                                        className:'set_library_item_name',
                                        filter_class:'set_library_item_name',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter name.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var library_item_name_title_field = Ti.UI.createLabel({
                                        text:'Name',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_name_field.add(library_item_name_title_field);
                                var library_item_name_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(library_item_name_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_library_item_name,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                library_item_name_field.add(library_item_name_content_field);
                                self.data.push(library_item_name_field);
                                library_item_name_content_field.addEventListener('change',function(e){
                                        _library_item_name = e.value;
                                });
                                library_item_name_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,1);
                                });         
                                library_item_name_content_field.addEventListener('focus',function(e){                                        
                                        _is_library_item_name_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                library_item_name_content_field.addEventListener('blur',function(e){
                                        _is_library_item_name_field_focused = false;
                                        _selected_field_object = null;
                                });                                  
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_name_field');
                                return;
                        }                                   
                }
                /**
                 *  init library item abbr field
                 */                    
                function _init_library_item_abbr_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;   
                                var is_required_field = false;                                   
                                var library_item_abbr_field = Ti.UI.createTableViewRow({
                                        className:'set_library_item_abbr',
                                        filter_class:'set_library_item_abbr',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter abbr.',//for check value
                                        height:self.default_table_view_row_height
                                });
                                var library_item_abbr_title_field = Ti.UI.createLabel({
                                        text:'Abbr',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_abbr_field.add(library_item_abbr_title_field);
                                var library_item_abbr_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(library_item_abbr_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_library_item_abbr,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        returnKeyType: Ti.UI.RETURNKEY_NEXT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                library_item_abbr_field.add(library_item_abbr_content_field);
                                self.data.push(library_item_abbr_field);
                                library_item_abbr_content_field.addEventListener('change',function(e){
                                        _library_item_abbr = e.value;
                                }); 
                                library_item_abbr_content_field.addEventListener('return',function(e){
                                        self.check_and_set_object_focus(0,field_num,2);
                                });                  
                                library_item_abbr_content_field.addEventListener('focus',function(e){                                        
                                        _is_library_item_abbr_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                library_item_abbr_content_field.addEventListener('blur',function(e){
                                        _is_library_item_abbr_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_abbr_field');
                                return;
                        }                                   
                }
                /**
                 *  init library item price field
                 */                    
                function _init_library_item_price_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;   
                                var is_required_field = false;                                
                                var library_item_price_field = Ti.UI.createTableViewRow({
                                        className:'set_library_item_price',
                                        filter_class:'set_library_item_price',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter price.',//for check value
                                        valueCheckExtra:'price',
                                        valueCheckPrompt:'Invalid price.',
                                        height:self.default_table_view_row_height
                                });
                                var library_item_price_title_field = Ti.UI.createLabel({
                                        top:5,
                                        text:'Price ('+Ti.App.Properties.getString('selected_currency')+')',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_price_field.add(library_item_price_title_field);
                                var library_item_price_example_field = Ti.UI.createLabel({
                                        bottom:2,
                                        text:'(e.g 1.23)',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.small_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_price_field.add(library_item_price_example_field);                                
                                var library_item_price_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(library_item_price_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_library_item_price,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        keyboardType:Titanium.UI.KEYBOARD_DECIMAL_PAD,
                                        returnKeyType: (_is_item_management)?Ti.UI.RETURNKEY_NEXT:Ti.UI.RETURNKEY_DEFAULT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                library_item_price_field.add(library_item_price_content_field);
                                self.data.push(library_item_price_field);
                                library_item_price_content_field.addEventListener('change',function(e){                                       
                                        if(_library_item_price != e.value){
                                                _is_make_changed = true;
                                        }
                                        _library_item_price = e.value;
                                });  
                                library_item_price_content_field.addEventListener('return',function(e){
                                        if(_is_item_management){
                                                self.check_and_set_object_focus(0,field_num,2);
                                        }
                                });                                 
                                library_item_price_content_field.addEventListener('focus',function(e){                                        
                                        _is_library_item_price_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                library_item_price_content_field.addEventListener('blur',function(e){
                                        _is_library_item_price_field_focused = false;
                                        _selected_field_object = null;
                                });                                 
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_price_field');
                                return;
                        }                                   
                }   
                /**
                 *  init library item stock field
                 *  if user select "item management" then display this field, otherwise hide it
                 */                    
                function _init_library_item_stock_field(){
                        try{
                                _current_field_num++;
                                var field_num = _current_field_num;   
                                var is_required_field = false;                                
                                var library_item_stock_field = Ti.UI.createTableViewRow({
                                        className:'set_library_item_stock',
                                        filter_class:'set_library_item_stock',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:2,//for check value
                                        valueType:'value',//for check value,
                                        valuePrompt:'Please enter stock.',//for check value
                                        valueCheckExtra:'stock',
                                        valueCheckPrompt:'Invalid stock (only accept integer e.g 120, -5).',
                                        height:self.default_table_view_row_height
                                });
                                var library_item_stock_title_field = Ti.UI.createLabel({
                                        top:5,
                                        text:'Stock',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_stock_field.add(library_item_stock_title_field);
                                var library_item_stock_example_field = Ti.UI.createLabel({
                                        bottom:2,
                                        text:'(e.g 120, -5)',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.small_font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                library_item_stock_field.add(library_item_stock_example_field);                                
                                var library_item_stock_content_field = Ti.UI.createTextField({
                                        width:self.set_a_field_width_in_table_view_row(library_item_stock_title_field.text),
                                        height:self.default_table_view_row_height,
                                        hintText:(is_required_field)?'Required':'Optional',
                                        textAlign:'right',
                                        right:30,
                                        value:_library_item_stock,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        },
                                        keyboardType:Titanium.UI.KEYBOARD_NUMBERS_PUNCTUATION,
                                        returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
                                        clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
                                });
                                library_item_stock_field.add(library_item_stock_content_field);
                                self.data.push(library_item_stock_field);
                                library_item_stock_content_field.addEventListener('change',function(e){                                       
                                        if(_library_item_stock != e.value){
                                                _is_make_changed = true;
                                        }
                                        _library_item_stock = e.value;
                                });                                
                                library_item_stock_content_field.addEventListener('focus',function(e){                                        
                                        _is_library_item_stock_field_focused = true;
                                        _selected_field_object = e.source;
                                });
                                library_item_stock_content_field.addEventListener('blur',function(e){
                                        _is_library_item_stock_field_focused = false;
                                        _selected_field_object = null;
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_stock_field');
                                return;
                        }                                   
                }                   
                /**
                 *  init library item description field
                 */                    
                function _init_library_item_description_field(){
                        try{
                                _current_field_num++;
                                var is_required_field = false;                                
                                var library_item_library_item_description_field = Ti.UI.createTableViewRow({
                                        className:'set_library_item_library_item_description',
                                        filter_class:'set_library_item_library_item_description',
                                        valueRequired:is_required_field,//for check value
                                        valuePosition:3,//for check value
                                        valueType:'text',//for check value
                                        valuePrompt:'Please enter description.',//for check value
                                        height:'auto',
                                        hasChild:true
                                });
                                var library_item_description_title_field = Ti.UI.createLabel({
                                        text:'Description',
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10,
                                        height:30,
                                        top:10
                                });
                                library_item_library_item_description_field.add(library_item_description_title_field);

                                var library_item_description_required_text_label = Ti.UI.createLabel({
                                        right:10,
                                        height:self.default_table_view_row_height,
                                        width:self.set_a_field_width_in_table_view_row(library_item_description_title_field.text),
                                        textAlign:'right',
                                        text:(is_required_field)?'Required':'Optional',
                                        opacity:self.hint_text_font_opacity,
                                        color:self.hint_text_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }                                        
                                });
                                library_item_library_item_description_field.add(library_item_description_required_text_label);

                                var library_item_description_content_field = Ti.UI.createLabel({
                                        top:5,
                                        bottom:5,
                                        right:10,
                                        height:'auto',
                                        width:self.set_a_field_width_in_table_view_row(_library_item_description.text),
                                        textAlign:'right',
                                        text:_library_item_description,
                                        color:self.selected_value_font_color,
                                        font:{
                                                fontSize:self.normal_font_size
                                        }
                                });
                                library_item_library_item_description_field.add(library_item_description_content_field);
                                self.data.push(library_item_library_item_description_field);
                                if((_library_item_description === '')||(_library_item_description === null)){                                        
                                        library_item_description_content_field.visible = false;
                                }else{
                                        library_item_description_required_text_label.visible = false;
                                }                               
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_description_field');
                                return;
                        }                                   
                }
                /**
                 *  init library item gst field
                 */                    
                function _init_library_item_gst_field(){
                        try{
                                _current_field_num++;                                 
                                var gst_field = Ti.UI.createTableViewRow({
                                        className:'set_include_gst',
                                        is_gst:_library_item_gst,
                                        filter_class:'set_include_gst',
                                        height:self.default_table_view_row_height
                                });
                                var gst_title_field = Ti.UI.createLabel({
                                        text:'Include '+_tax_name,
                                        color:self.font_color,
                                        font:{
                                                fontSize:self.font_size,
                                                fontWeight:self.font_weight
                                        },
                                        left:10
                                });
                                gst_field.add(gst_title_field);

                                var gst_switch = Titanium.UI.createSwitch({
                                        value:_library_item_gst,
                                        right:10,
                                        height:'auto'
                                });
                                gst_field.add(gst_switch);
                                gst_switch.addEventListener('change',function(e){
                                        _library_item_gst = e.value;
                                });
                                self.data.push(gst_field);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_library_item_gst_field');
                                return;
                        }                                   
                }
                /**
                 *  init library item delete button field
                 */                    
                function _init_delete_btn(){
                        try{
                                var deleteButtonField = Ti.UI.createTableViewRow({
                                        className:'set_delete_button',
                                        filter_class:'set_delete_button',
                                        header:'',
                                        valueRequired:false
                                });
                                var deleteButton = Ti.UI.createButton({
                                        title:'Delete',
                                        backgroundImage:self.get_file_path('image', 'BUTT_red_off.png'),
                                        textAlign:'center',
                                        height:self.default_table_view_row_height,
                                        width:(self.is_ipad())?self.screen_width-self.ipad_button_reduce_length_in_tableview:self.screen_width-self.iphone_button_reduce_length_in_tableview
                                });
                                deleteButtonField.add(deleteButton);
                                self.data.push(deleteButtonField);
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _init_delete_btn');
                                return;
                        }   
                }
                /**
                 * display library item type list
                 */
                function _event_for_library_item_type(e){
                        try{
                                var library_item_win = Ti.UI.createWindow({
                                        url:self.get_file_path('url', 'base/select_unique_code_from_table_view.js'),
                                        win_title:'Select Library Item Type',
                                        table_name:'my_job_library_item_type_code',//table name
                                        display_name:'name',//need to shwo field
                                        content:e.row.library_item_type_code,
                                        content_value:e.row.library_item_type_name,
                                        source:'edit_library_item'
                                });
                                Titanium.UI.currentTab.open(library_item_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_library_item_type');
                                return;
                        }                                   
                }        
                /**
                 * display library item description edit page
                 */                
                function _event_for_library_item_description(e){
                        try{
                                var note_win = Ti.UI.createWindow({
                                        title:'Edit Description',
                                        url:self.get_file_path('url', 'base/edit_textarea_field.js'),
                                        content:_library_item_description,
                                        source:'edit_library_item_description'
                                });
                                Titanium.UI.currentTab.open(note_win,{
                                        animated:(self.is_ios_7_plus() && !self.set_animated_for_ios7)?false:true
                                });                                    
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_library_item_description');
                                return;
                        }
                }
                /**
                 *  delete button click event
                 */
                function _event_for_delete_btn(){
                        try{
                                var optionDialog = Ti.UI.createOptionDialog({
                                        options:(self.is_ipad())?['YES','NO','']:['YES','NO'],
                                        buttonNames:['Cancel'],
                                        destructive:0,
                                        cancel:1,
                                        title:'Do you want to delete this library item?'
                                });
                                optionDialog.show();
                                optionDialog.addEventListener('click',function(e){
                                        if(e.index == 0){
                                                if(_selected_library_item_id > 1000000){
                                                        var db = Titanium.Database.open(self.get_db_name());
                                                        db.execute('DELETE FROM my_job_library_item WHERE id=?',_selected_library_item_id);
                                                        db.close();
                                                        win.close();
                                                }else{
                                                        if(!Ti.Network.online){
                                                                self.show_message(L('message_offline'),L('message_unable_to_connect'));
                                                                return;
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
                                                                                self.update_selected_tables(null,'JobLibraryItem',JSON.parse(this.responseText)); 
                                                                                self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));
                                                                                if(_parent_win != null){
                                                                                        _parent_win.close();
                                                                                }                                                                                  
                                                                                win.close();
                                                                        }else{
                                                                                var params = {
                                                                                        message:'Remove library item failed.',
                                                                                        show_message:true,
                                                                                        message_title:'',
                                                                                        send_error_email:true,
                                                                                        error_message:'',
                                                                                        error_source:window_source+' - _event_for_delete_btn - xhr.onload -1',
                                                                                        server_response_message:this.responseText
                                                                                };
                                                                                self.processXYZ(params);                                                                                
                                                                                return;
                                                                        }
                                                                }catch(e){
                                                                        params = {
                                                                                message:'Remove library item failed.',
                                                                                show_message:true,
                                                                                message_title:'',
                                                                                send_error_email:true,
                                                                                error_message:e,
                                                                                error_source:window_source+' - _event_for_delete_btn - xhr.onload -2',
                                                                                server_response_message:this.responseText
                                                                        };
                                                                        self.processXYZ(params);  
                                                                        return;
                                                                }                            

                                                        };
                                                        xhr.onerror = function(e){
                                                                self.hide_indicator();
                                                                var params = {
                                                                        message:'Remove library item failed.',
                                                                        show_message:true,
                                                                        message_title:'',
                                                                        send_error_email:true,
                                                                        error_message:e,
                                                                        error_source:window_source+' - _event_for_delete_btn - xhr.onerror',
                                                                        server_response_message:this.responseText
                                                                };
                                                                self.processXYZ(params);  
                                                                return;
                                                        };
                                                        xhr.onsendstream = function(e){
                                                                self.update_progress(e.progress,true);
                                                        };
                                                        xhr.setTimeout(self.default_time_out);
                                                        xhr.open('POST',self.get_host_url()+'update',false);
                                                        xhr.send({
                                                                'type':'remove_library_item',
                                                                'hash':_selected_user_id,
                                                                'id':_selected_library_item_id,
                                                                'company_id':_selected_company_id,
                                                                'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                                                'app_version_increment':self.version_increment,
                                                                'app_version':self.version,
                                                                'app_platform':self.get_platform_info()
                                                        });

                                                }
                                        }
                                });
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _event_for_delete_btn');
                                return;
                        }                                   
                }
                /**
                 *  save event
                 */
                function _save(){
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
                                        if(self.data[i].valueCheckExtra != null){
                                                if(self.data[i].children[self.data[i].valuePosition-1].value != ''){
                                                        if(self.data[i].valueCheckExtra === 'price'){
                                                                if(!self.check_valid_price(_library_item_price)){
                                                                        error_string += self.data[i].valueCheckPrompt+'\n';
                                                                }
                                                        }
                                                        if(self.data[i].valueCheckExtra === 'stock'){
                                                                if(!self.check_valid_negative_and_positive_integer(_library_item_stock)){
                                                                        error_string += self.data[i].valueCheckPrompt+'\n';
                                                                }
                                                        }                                                        
                                                }
                                        }
                                }


                                if(error_string != ''){
                                        self.show_message(error_string);
                                        return;
                                }
                                self.display_indicator('Saving Data...',true);

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
                                                        var temp_result = JSON.parse(this.responseText);
                                                        if((temp_result.error != undefined)&&(temp_result.error.length >0)){
                                                                self.hide_indicator();
                                                                error_string = '';
                                                                for(i=0,j=temp_result.error.length;i<j;i++){
                                                                        if(i==j){
                                                                                error_string+=temp_result.error[i];
                                                                        }else{
                                                                                error_string+=temp_result.error[i]+'\n';
                                                                        }
                                                                }
                                                                self.show_message(error_string);
                                                                return;
                                                        }else{
                                                                self.update_selected_tables(null,'JobLibraryItem',JSON.parse(this.responseText));
                                                                if(_is_item_management){
                                                                        self.update_selected_tables(null,'MaterialsStocks',JSON.parse(this.responseText));
                                                                }
                                                                self.update_selected_tables(null,'Summary',JSON.parse(this.responseText));
                                                                self.hide_indicator();
                                                                if(_is_click_main_menu_btn){//menu menu
                                                                        self.close_all_window_and_return_to_menu(); 
                                                                }else{                                                                
                                                                        win.close();
                                                                }                                                                
                                                        }
                                                }else{
                                                        self.hide_indicator();
                                                        var params = {
                                                                message:'Save library item failed.',
                                                                show_message:true,
                                                                message_title:'',
                                                                send_error_email:true,
                                                                error_message:'',
                                                                error_source:window_source+' - _save - xhr.onload - 1',
                                                                server_response_message:this.responseText
                                                        };
                                                        self.processXYZ(params);                                                          
                                                        return;
                                                }
                                        }catch(e){
                                                self.hide_indicator();
                                                params = {
                                                        message:'Save library item failed.',
                                                        show_message:true,
                                                        message_title:'',
                                                        send_error_email:true,
                                                        error_message:e,
                                                        error_source:window_source+' - _save - xhr.onload - 2',
                                                        server_response_message:this.responseText
                                                };
                                                self.processXYZ(params);     
                                                return;
                                        }
                                };
                                xhr.onerror = function(e){
                                        self.hide_indicator();
                                        var params = {
                                                message:'Save library item failed.',
                                                show_message:true,
                                                message_title:'',
                                                send_error_email:true,
                                                error_message:e,
                                                error_source:window_source+' - _save - xhr.onerror',
                                                server_response_message:this.responseText
                                        };
                                        self.processXYZ(params);    
                                        return;
                                };
                                xhr.onsendstream = function(e){
                                        self.update_progress(e.progress,true);
                                };
                                xhr.setTimeout(self.default_time_out);
                                xhr.open('POST',self.get_host_url()+'update',false);
                                xhr.send({
                                        'type':'save_library_item',
                                        'hash':_selected_user_id,
                                        'id':_selected_library_item_id,
                                        'reference_number':_selected_library_item_reference_number,
                                        'company_id':_selected_company_id,
                                        'job_library_item_type_code':_library_item_type_code,
                                        'item_name':(_library_item_name != '')?self.trim(_library_item_name):'',
                                        'item_abbr':(_library_item_abbr != '')?self.trim(_library_item_abbr):'',
                                        'description':(_library_item_description != '')?self.trim(_library_item_description):'',
                                        'price':self.currency_formatted(parseFloat(_library_item_price)),
                                        'is_item_management':_is_item_management,
                                        'stock':parseInt(_library_item_stock),
                                        'materials_locations_id':_selected_materials_locations_id,
                                        'inc_gst':_library_item_gst,
                                        'status_code':1,
                                        'app_security_session':self.is_simulator()?self.default_udid:Titanium.Platform.id,
                                        'app_version_increment':self.version_increment,
                                        'app_version':self.version,
                                        'app_platform':self.get_platform_info()
                                });                                
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _save');
                                return;
                        }     
                }
                /**
                 *  check these fields if have been changed
                 */
                function _check_if_make_change(){
                        try{
                                if(!_is_make_changed){  
                                        //check if make any change
                                        //if make any change then prompt to save or update
                                        //else return to "view job" page
                                        var db = Titanium.Database.open(self.get_db_name());
                                        var rows = db.execute('SELECT * FROM my_job_library_item WHERE id=?',_selected_library_item_id);
                                        if(_library_item_name != rows.fieldByName('item_name')){
                                                _is_make_changed = true;
                                        }
                                        if((!_is_make_changed)&&(_library_item_abbr != rows.fieldByName('item_abbr'))){
                                                _is_make_changed = true;
                                        }
                                        if((!_is_make_changed)&&(_library_item_type_code != rows.fieldByName('job_library_item_type_code'))){
                                                _is_make_changed = true;
                                        }
                                        if((!_is_make_changed)&&(_library_item_description != rows.fieldByName('description'))){
                                                _is_make_changed = true;
                                        }
                                        if((!_is_make_changed)&&(_library_item_price != rows.fieldByName('price'))){
                                                _is_make_changed = true;
                                        }
                                        if((!_is_make_changed)&&(_library_item_gst != rows.fieldByName('inc_gst'))){
                                                _is_make_changed = true;
                                        }
                                        rows.close();
                                        db.close();
                                }
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _check_if_make_change');
                                return;
                        }                           
                }
                /**
                 *  remove selected library item
                 */
                function _clean_database_and_file(library_item_id){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());
                                db.execute('delete from my_job_library_item where id=?',library_item_id);
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _clean_database_and_file');
                                return;
                        }                                   
                }        
        }

        win.addEventListener('focus',function(){
                try{
                        if(library_item_edit_library_item_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                library_item_edit_library_item_page.prototype = new F();
                                library_item_edit_library_item_page.prototype.constructor = library_item_edit_library_item_page;
                                library_item_edit_library_item_page_obj = new library_item_edit_library_item_page();
                                library_item_edit_library_item_page_obj.init();
                        }else{
                                library_item_edit_library_item_page_obj.update_field_value_after_set_properites(); 
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        library_item_edit_library_item_page_obj.close_window();
                        library_item_edit_library_item_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }                                
        });
}());