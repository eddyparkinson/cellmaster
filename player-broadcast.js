// Generated by LiveScript 1.5.0
(function(){
  this.include = function(){
    this['with']('client');
    return this.client({
      '/player/broadcast.js': function(){
        var SocialCalc, parseQuery, md5;
        SocialCalc = window.SocialCalc || alert('Cannot find window.SocialCalc');
        if (SocialCalc != null && SocialCalc.OrigDoPositionCalculations) {
          return;
        }
        parseQuery = function(qstr){
          var query, params, index, pair;
          if (qstr.charAt(0) === '?') {
            qstr = qstr.substr(1);
          }
          query = {};
          params = qstr.split('&');
          for (index in params) {
            pair = params[index].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
          }
          return query;
        };
        SocialCalc.requestParams = parseQuery(window.location.search);
        SocialCalc.OrigDoPositionCalculations = SocialCalc.DoPositionCalculations;
        SocialCalc.DoPositionCalculations = function(){
          var ref$;
          SocialCalc.OrigDoPositionCalculations.apply(SocialCalc, arguments);
          if (typeof (ref$ = SocialCalc.Callbacks).broadcast == 'function') {
            ref$.broadcast('ask.ecell');
          }
        };
        if (window.CryptoJS) {
          md5 = function(it){
            return CryptoJS.MD5(it).toString();
          };
          SocialCalc.hadSnapshot = true;
          SocialCalc.OrigLoadEditorSettings = SocialCalc.LoadEditorSettings;
          SocialCalc.LoadEditorSettings = function(editor, str, flags){
            editor.SettingsCallbacks.ethercalc = {
              save: function(){
                return "ethercalc:" + md5(editor.context.sheetobj.CreateSheetSave()) + "\n";
              },
              load: function(editor, setting, line, flags){
                var hash;
                hash = line.replace(/^\w+:/, '');
                if (hash === md5(editor.context.sheetobj.CreateSheetSave())) {
                  return SocialCalc.hadSnapshot = false;
                } else {
                  return SocialCalc.hadSnapshot = true;
                }
              }
            };
            SocialCalc.LoadEditorSettings = SocialCalc.OrigLoadEditorSettings;
            return SocialCalc.OrigLoadEditorSettings(editor, str, flags);
          };
        } else {
          SocialCalc.hadSnapshot = false;
        }
        SocialCalc.OrigSizeSSDiv = SocialCalc.SizeSSDiv;
        SocialCalc.SizeSSDiv = function(spreadsheet){
          if (!(spreadsheet != null && spreadsheet.parentNode)) {
            return;
          }
          return SocialCalc.OrigSizeSSDiv(spreadsheet);
        };
        SocialCalc.Sheet.prototype.ScheduleSheetCommands = function(){
          return SocialCalc.ScheduleSheetCommands.apply(SocialCalc, [this].concat([].slice.call(arguments)));
        };
        SocialCalc.OrigScheduleSheetCommands = SocialCalc.ScheduleSheetCommands;
        SocialCalc.ScheduleSheetCommands = function(sheet, cmdstr, saveundo, isRemote){
          var ref$, ref1$, i$, ref2$, len$, ref3$, link, title;
          cmdstr = cmdstr.replace(/\n\n+/g, '\n');
          if (!/\S/.test(cmdstr)) {
            return;
          }
          if (!isRemote && cmdstr !== 'redisplay' && cmdstr !== 'recalc') {
            if (((ref$ = window.__MULTI__) != null && ((ref1$ = ref$.rows) != null && ref1$.length)) && /set \w+ formula /.exec(cmdstr)) {
              for (i$ = 0, len$ = (ref2$ = window.__MULTI__.rows).length; i$ < len$; ++i$) {
                ref3$ = ref2$[i$], link = ref3$.link, title = ref3$.title;
                cmdstr = cmdstr.replace(RegExp('\\$' + title + '\\.([A-Z]+[1-9][0-9]*)', 'ig'), "\"" + link.replace('/', '') + "\"!$1");
              }
            }
            if (typeof (ref2$ = SocialCalc.Callbacks).broadcast == 'function') {
              ref2$.broadcast('execute', {
                cmdstr: cmdstr,
                saveundo: saveundo,
                room: sheet._room
              });
            }
          }
          return SocialCalc.OrigScheduleSheetCommands(sheet, cmdstr, saveundo, isRemote);
        };
        return SocialCalc.MoveECell = function(editor, newcell){
          var highlights, ref$, cell, f;
          highlights = editor.context.highlights;
          if (editor.ecell) {
            if (editor.ecell.coord === newcell) {
              return newcell;
            }
            if (typeof (ref$ = SocialCalc.Callbacks).broadcast == 'function') {
              ref$.broadcast('ecell', {
                original: editor.ecell.coord,
                ecell: newcell
              });
            }
            cell = SocialCalc.GetEditorCellElement(editor, editor.ecell.row, editor.ecell.col);
            delete highlights[editor.ecell.coord];
            if (editor.range2.hasrange && editor.ecell.row >= editor.range2.top && editor.ecell.row <= editor.range2.bottom && editor.ecell.col >= editor.range2.left && editor.ecell.col <= editor.range2.right) {
              highlights[editor.ecell.coord] = 'range2';
            }
            editor.UpdateCellCSS(cell, editor.ecell.row, editor.ecell.col);
            editor.SetECellHeaders('');
            editor.cellhandles.ShowCellHandles(false);
          } else {
            if (typeof (ref$ = SocialCalc.Callbacks).broadcast == 'function') {
              ref$.broadcast('ecell', {
                ecell: newcell
              });
            }
          }
          newcell = editor.context.cellskip[newcell] || newcell;
          editor.ecell = SocialCalc.coordToCr(newcell);
          editor.ecell.coord = newcell;
          cell = SocialCalc.GetEditorCellElement(editor, editor.ecell.row, editor.ecell.col);
          highlights[newcell] = 'cursor';
          for (f in editor.MoveECellCallback) {
            editor.MoveECellCallback[f](editor);
          }
          editor.UpdateCellCSS(cell, editor.ecell.row, editor.ecell.col);
          editor.SetECellHeaders('selected');
          for (f in editor.StatusCallback) {
            editor.StatusCallback[f].func(editor, 'moveecell', newcell, editor.StatusCallback[f].params);
          }
          if (editor.busy) {
            editor.ensureecell = true;
          } else {
            editor.ensureecell = false;
            editor.EnsureECellVisible();
          }
          return newcell;
        };
      }
    });
  };
}).call(this);
