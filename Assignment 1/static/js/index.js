'use strict'
function BestSellingBooks(){

    BestSellingBooks.prototype.init = () => {
        $('.modal').modal();
        bindEvents();
    };

    function reloadPage(){
        var deferred = $.Deferred();
        var $parent = $('#div_parent');
        $.get('/reload').then((responseData) => {
            // console.log(responseData);
            $parent.children().remove();
            $parent.append(responseData);
            bindEvents();
            return deferred.resolve();
        })
        .fail(() =>{
            return deferred.reject();
        });
        return deferred.promise();
    };

    function bindEvents(){
        $(document).on({
            ajaxStart: function(){
               console.log('ajaxStart');
            },
            ajaxStop: function(){ 
                console.log('ajaxStart');
            }    
        });
        $('.btn-edit').on('click',(e) => {
            var data = JSON.parse($(e.currentTarget).parent().find('.inp_data').val());
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemEditDialog(dialogOptions, data);
            dialog.open();
        });
        $('.btn-delete').on('click', (e) => {
            var data = JSON.parse($(e.currentTarget).parent().find('.inp_data').val());
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemDeleteDialog(dialogOptions, data);
            dialog.open();
        });
        $('#btn_add').on('click', (e) => {
            var dialogOptions = {
                dismissible: false
            };
            let dialog = new ItemAddDialog(dialogOptions);
            dialog.open();
        });
    };

    function ItemAddDialog(options){
        var self =this;
        var data = {};

        ItemAddDialog.prototype.onOpenEnd = () =>{
            $('#op_title').text('Add:');
            $('#btn_save').text('Add');
            bindDialogEvents();
        }

        function bindDialogEvents(){
            $('input').on('change paste keyup',(e) => {
                $(e.currentTarget).addClass('modified');
            });
            $('#btn_save').on('click',(e) => {
                if(!$('#modal1').find('input').hasClass('modified')){
                    M.Toast.dismissAll();
                    M.toast({html: 'No Changes has been made'});
                }else{
                    data.title = $('#em_title').val();
                    data.author = $('#em_author').val();
                    data.format = $('#em_format').val();
                    data.price = $('#em_price').val();
                    createData(data);
                }
            });

            $('#btn_cancel').on('click', () => {
                dialog.close();
            });
        };

        function createData(data){
            var deferred = $.Deferred();
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/create_data'
            })
            .then(() => {
                return reloadPage();
            })
            .then(() => {
                dialog.close();
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        }

        var create_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        var dialog = new ItemDialog(create_options);
        return dialog;
    }

    function ItemEditDialog(options, data){
        var self = this;
        

        ItemEditDialog.prototype.onOpenEnd = () => {
            $('#op_title').text('Edit:');
            $('#btn_save').text('Edit');
            $('#em_title').val(data.title);
            $('#em_author').val(data.author);
            $('#em_format').val(data.format);
            $('#em_price').val(data.price);
            console.log(data);
            bindDialogEvents();
            M.updateTextFields()
        };

        function bindDialogEvents(){
            $('input').on('change paste keyup',(e) => {
                $(e.currentTarget).addClass('modified');
            });
            $('#btn_save').on('click',(e) => {
                if(!$('#modal1').find('input').hasClass('modified')){
                    M.Toast.dismissAll();
                    M.toast({html: 'No Changes has been made'});
                }else{
                    data.title = $('#em_title').val();
                    data.author = $('#em_author').val();
                    data.format = $('#em_format').val();
                    data.price = $('#em_price').val();
                    updateData(data);
                }
            });

            $('#btn_cancel').on('click', () => {
                console.log('btnCancel clicked')
                dialog.close();
            });
        };

        function updateData(data){
            var deferred = $.Deferred();
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/update_data'
            })
            .then(() => {
                return reloadPage();
            })
            .then(() => {
                dialog.close();
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        };

        var edit_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        var dialog = new ItemDialog(edit_options);
    
        
        return dialog;
    };

    function ItemDeleteDialog(options, data){
        var self = this;
        ItemDeleteDialog.prototype.onOpenEnd = () => {
            $('#op_title').text('Delete:');
            $('#btn_save').text('Delete');
            $('#em_title').val(data.title);
            $('#em_author').val(data.author);
            $('#em_format').val(data.format);
            $('#em_price').val(data.price);
            $('#modal1').find('input').attr('readonly', 'true');
            $('#modal1').find('input').attr('disabled', 'true');
            bindDialogEvents();
            M.updateTextFields()
        };

        function bindDialogEvents(){
            $('#btn_save').on('click',(e) => {
                deleteData(data)
            });
            $('#btn_cancel').on('click', () => {
                dialog.close();
            });
        }

        function deleteData(data){
            var deferred = $.Deferred();
            $.ajax({
                contentType: 'application/json',
                data: JSON.stringify(data),
                dataType: 'json',
                type: 'POST',
                url: '/delete_data'
            })
            .then(() => {
                return reloadPage();
            })
            .then(() => {
                dialog.close();
                return deferred.resolve();
            }).fail(() => {
                return deferred.reject();
            });
            return deferred.promise();
        };

        var delete_options = {
            ...options,
            onOpenEnd: self.onOpenEnd
        };

        var dialog = new ItemDialog(delete_options);
        return dialog;
    }

    function ItemDialog(options){
        var self = this;
        var $modal = $('#modal1');
        ItemDialog.prototype.open = () =>{
            $modal.modal('open');
        };
        ItemDialog.prototype.close = () =>{
            $modal.modal('close');
        };

        ItemDialog.prototype.onCloseStart = () => {
            $modal.find('input').each((id, elem)=>{
                $(elem).val('');
            });
            $modal.find('input').removeAttr('readonly');
            $modal.find('input').removeAttr('disabled');
            $modal.find('input').off();
            $('btn_save').off();
            M.updateTextFields()
        };

        $modal.modal(options);
        var opt = {
            ...options,
            onCloseStart: self.onCloseStart
        }
        console.log(opt);
        console.log(options);
        $modal.modal(opt);
    };
    
};


$(() =>{
    var books = new BestSellingBooks();
    books.init();
});