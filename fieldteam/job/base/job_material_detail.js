//display job detail
(function(){
        Titanium.include(Ti.App.Properties.getString('base_folder_name')+'fieldteam.js');
        var win = Titanium.UI.currentWindow;
        var job_base_job_material_detail_page_obj = null;

        function job_base_job_material_detail_page(){
                var self = this;
                var window_source = 'job_base_job_material_detail_page';
                win.title = 'Material Detail';

                //public method
                /**
                 *  override init function of parent class: fieldteam.js
                 */                 
                self.init = function(){
                        try{         
                                self.init_auto_release_pool(win);
                                self.data = [];
                                //call init_navigation_bar function of parent class: fieldteam.js
                                self.init_navigation_bar('','Main,Back');                                
                                self.init_vars();
                                self.init_table_view();//inherite init_table_view function from parent class
                                self.init_no_result_label();//inherite init_no_result_label function from parent class                                
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
                                _display_material_item();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - self.init_vars');
                                return;
                        }
                };                                       
                
                //private member
                var _type = win.type;
                var _selected_job_id = win.job_id;
                var _selected_job_assigned_item_id = win.job_assigned_item_id;
                var _selected_currency = self.get_selected_currency();
                //private method
                /**
                 *  display history 
                 */
                function _display_material_item(){
                        try{
                                var db = Titanium.Database.open(self.get_db_name());                           
                                var rows = db.execute('SELECT a.*,b.name as location_name,c.price as price,c.item_name as item_name,c.description as item_description FROM my_'+_type+'_assigned_item as a '+                                        
                                        'left join my_materials_locations b on (b.id = a.materials_locations_id)'+
                                        'left join my_job_library_item c on (a.job_library_item_id= c.id) '+
                                        'WHERE a.id=? and a.status_code=1 and a.'+_type+'_id=? ORDER BY a.id desc',_selected_job_assigned_item_id,_selected_job_id);
                                var b=0;
                                if(rows.getRowCount() > 0){
                                        while(rows.isValidRow()){
                                                var new_text = '';
                                                var price = (rows.fieldByName('price') == null)?0:rows.fieldByName('price');   
                                                new_text+='Name : '+((rows.fieldByName('item_name') == null)?'Unknown':rows.fieldByName('item_name'))+'\n';
                                                new_text+='Units : '+rows.fieldByName('units')+'\n';
                                                new_text+='Price : '+_selected_currency+self.currency_formatted(rows.fieldByName('units')*price)+'\n';                                                
                                                new_text+='Source : '+(((rows.fieldByName('location_name') == '') || (rows.fieldByName('location_name') == null))?'N/A':rows.fieldByName('location_name'))+'\n';
                                                new_text+='Description:'+rows.fieldByName('item_description')+'\n';
                                                var new_row = null;
                                                new_row = Ti.UI.createTableViewRow({
                                                        className:'data_row_'+b,
                                                        filter_class:'job_material_item',
                                                        height:'auto'
                                                });
                                                new_row.add(Ti.UI.createLabel({
                                                        text:new_text,
                                                        textAlign:'left',
                                                        height:'auto',
                                                        width:(self.is_ipad())?self.screen_width-100:'auto',
                                                        left:10,
                                                        top:10,
                                                        bottom:10
                                                }));
                                                self.data.push(new_row);
                                                rows.next();
                                                b++;
                                        }     
                                }
                                rows.close();
                                db.close();
                        }catch(err){
                                self.process_simple_error_message(err,window_source+' - _display_material_item');
                                return;
                        }
                }
        }

        win.addEventListener('open',function(){
                try{
                        if(job_base_job_material_detail_page_obj === null){
                                var F = function(){};
                                F.prototype = FieldTeam.prototype;
                                job_base_job_material_detail_page.prototype = new F();
                                job_base_job_material_detail_page.prototype.constructor = job_base_job_material_detail_page;
                                job_base_job_material_detail_page_obj = new job_base_job_material_detail_page();
                                job_base_job_material_detail_page_obj.init();
                        }
                }catch(err){
                        alert(err);
                        return;
                }                        
        });

        win.addEventListener('close',function(){
                try{
                        job_base_job_material_detail_page_obj.close_window();
                        job_base_job_material_detail_page_obj = null;
                        win = null;
                }catch(err){
                        alert(err);
                        return;
                }
        });
}());


