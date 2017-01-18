/*globals define*/
/*jshint node:true, browser:true*/

/**
 * Generated by PluginGenerator 1.7.0 from webgme on Tue Nov 15 2016 18:47:55 GMT-0600 (Central Standard Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'text!./Templates/index.html',
    'common/util/ejs',
    'text!./Templates/methanepy.ejs',
    'text!./Templates/ch3py.ejs',
    'text!./Templates/ch2py.ejs',
    'text!./Templates/silanepy.ejs',
    'text!./Templates/ethanepy.ejs',
    'text!./Templates/polymerpy.ejs',
    'text!./Templates/copolymerpy.ejs'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    indexHtmlContent,
    ejs,
    methanePyTemplate,
    ch3PyTemplate,
    ch2PyTemplate,
    silanePyTemplate,
    ethanePyTemplate,
    polymerPyTemplate,
    copolymerPyTemplate) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);
    /**
     * Initializes a new instance of MoleculeCodeGenerator.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin MoleculeCodeGenerator.
     * @constructor
     */
    var MoleculeCodeGenerator = function () {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    };

    var PYTHON_EXE = "\"E:\\Program Files\\Anaconda3\\envs\\iModels\\python.exe\"";

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructue etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    MoleculeCodeGenerator.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    MoleculeCodeGenerator.prototype = Object.create(PluginBase.prototype);
    MoleculeCodeGenerator.prototype.constructor = MoleculeCodeGenerator;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(string, plugin.PluginResult)} callback - the result callback
     */
    MoleculeCodeGenerator.prototype.main = function (callback) {
        // Use self to access core, project, result, logger etc from PluginBase.
        // These are all instantiated at this point.
        var self = this,
            nodeObject;


        // Using the logger.
        self.logger.debug('This is a debug message.');
        self.logger.info('This is an info message.');
        self.logger.warn('This is a warning message.');
        self.logger.error('This is an error message.');

        // Using the coreAPI to make changes.

        nodeObject = self.activeNode;

        self.metaMoleculeInfo = {};
        var fs = require('fs');
        var path = require('path');
        var express = require('express');
        var app = express();
        app.locals.path = path;
        var artifact,
            molecule = {},
            iter; // iteration number of
        var example_dir;

        var metaNodeInfoJson;
        var metaMoleculeInfoJson;
        var metaNodesJson;
        var examplePY;
        var example_py;
        var example;
        var example_node;
        var example_type;
        var example_path;
        var python_template;

        self.loadNodeMap(self.rootNode)
            .then(function (nodes) {
                iter = 1;
                // self.getMoleculeInfo(self.rootNode, nodes, iter);
                molecule['molecule'] = self.getMoleculeInfo(nodeObject, nodes, iter);  // only return the example json
                metaMoleculeInfoJson = JSON.stringify(self.metaMoleculeInfo, null, 4);
                artifact = self.blobClient.createArtifact('project-data');

                // set PyTemplate for a node
                example_dir = self.makeid();
                var template_flag;
                var visited_node = new Set();

                function setPyTemplate(example, example_type, obj) {
                    switch(example_type) {
                        case 'Atom': {
                            switch (example) {
                                case 'H':
                                    self.logger.info('&&&&&&&&&& no template for H now  &&&&&&&&&&');
                                    template_flag = false;
                                    break;
                                default:
                                    self.logger.info('&&&&&&&&&& no template for this Atom now &&&&&&&&&&');
                                    break;
                            }
                            break;
                        }
                        case 'Molecule': {
                            switch(example) {
                                case 'Methane':
                                    python_template = methanePyTemplate;
                                    template_flag = true;
                                    break;
                                case '-CH3':
                                    python_template = ch3PyTemplate;
                                    template_flag = true;
                                    break;
                                case '-CH2-':
                                    python_template = ch2PyTemplate;
                                    template_flag = true;
                                    break;
                                case '-Silane-':
                                    python_template = silanePyTemplate;
                                    template_flag = true;
                                    break;
                                default:
                                    self.logger.info('&&&&&&&&&& no template for this Molecule now &&&&&&&&&&');
                                    break;
                            }
                            break;
                        }
                        case 'Polymer': {
                            switch (example) {
                                case 'Ethane':
                                    python_template = ethanePyTemplate;
                                    template_flag = true;
                                    break;
                                case 'CH3-CH2-CH3':
                                    python_template = polymerPyTemplate;
                                    template_flag = true;
                                    break;
                                default:
                                    python_template = polymerPyTemplate;
                                    template_flag = true;
                                    self.logger.info('########## use general template for this Polymer ##########');
                                    break;
                            }
                            break;
                        }
                        case 'Copolymer': {
                            switch (example) {
                                case 'CH3-CH2-Silane-CH3':
                                    python_template = copolymerPyTemplate;
                                    template_flag = true;
                                    break;
                                default:
                                    python_template = copolymerPyTemplate;
                                    template_flag = true;
                                    self.logger.info('########## use general template for this Copolymer ##########');
                                    break;
                            }
                            break;
                        }
                        case 'Port2Port': {
                            self.logger.info('&&&&&&&&&& need further development for Port2Port type &&&&&&&&&&');
                            // template_flag = false;
                            break;
                        }
                        default: {
                            self.logger.error('&&&&&&&&&& didn\'t find: ', example_type, ' &&&&&&&&&&');
                            // template_flag = false;
                        }// self.logger.error('didn\'t find: ', example);
                    }
                    if (template_flag) {
                        molecule['molecule'] = obj;
                        examplePY = ejs.render(python_template, molecule);
                        // self.logger.info(example);
                        // self.logger.info('type +++++++++', typeof example);
                        example = example.replace(/-/g, '_');
                        // self.logger.info(example);

                        // write the file to the example folder
                        self.logger.info('########## Write ', example, ' to example folder ##########');
                        example_py = example+'.py';
                        example_path = path.join(example_dir, example_py);
                        fs.writeFileSync(example_path, examplePY);

                        // write the file to the lib folder and save the directory to the pyfile_dir attribute in order to copy the file in the future.
                        self.logger.info('########## Write ', example, ' to lib folder ##########');
                        var lib_dir = self.makedir(example_type);
                        var lib_path = path.join(lib_dir, example_py);
                        fs.writeFileSync(lib_path, examplePY);

                        example_node = nodes[obj['path']];
                        var base_node = self.core.getBase(example_node);
                        self.logger.info('########## set pyfile_dir attribute for ', example, ' ##########');

                        var file_hash = self.blobClient.putFile(example_py, examplePY);
                        self.logger.info('##########', file_hash, '##########');

                        if (self.core.getAttribute(example_node, 'name') == self.core.getAttribute(base_node, 'name')) {
                            self.logger.info('########## set pyfile attribute for ', example, ' ##########');
                            self.core.setAttribute(base_node, 'pyfile', file_hash);

                            self.core.setAttribute(base_node, 'pyfile_dir', lib_path);
                        }
                        else {
                            self.logger.info('########## set pyfile attribute for ', example, ' ##########');
                            self.core.setAttribute(example_node, 'pyfile', file_hash);

                            self.core.setAttribute(example_node, 'pyfile_dir', lib_path);
                        }
                        template_flag = false
                    }
                }

                // dfs go through the whole json structure. The advantage of dfs is to get the basic level of the whole sturcture,
                // so that if we visit a node which is already known, we can use the associated pyfile directly.
                function walkJson(obj) {
                    example = obj['name'];
                    example_type = obj['metaType'];
                    if (!visited_node.has(example)) {
                        self.logger.info('@@@@@@@@@@ ', obj.hasOwnProperty('pyfile_dir'), obj['pyfile_dir'], '@@@@@@@@@@');
                        if (obj.hasOwnProperty('pyfile_dir') && obj['pyfile_dir'] ) {
                            self.logger.info('########## we already had a pyfile for the node', 'pyfile_dir: ', obj['pyfile_dir'], ' ##########');
                            var source = path.join(process.cwd(), obj['pyfile_dir']);
                            example_py = example.replace(/-/g, '_')+'.py';
                            example_path = path.join(example_dir, example_py);
                            var destination = example_path;
                            var ncp = require('ncp').ncp;
                            ncp.limit = 16;
                            ncp(source, destination, function (err){
                                if (err) {
                                    return console.error(err);
                                }
                                console.log('ncp copy file', source,  'done!');
                            });
                        }
                        else {
                            setPyTemplate(example, example_type, obj);
                        }
                        visited_node.add(example);
                    }
                    if (obj.hasOwnProperty('children') && obj['children']) {
                        var children = obj['children'];
                        for (var key in children) {
                            if (children.hasOwnProperty(key)) {
                                var val = children[key];
                                // self.logger.info("*******", key, val);
                                walkJson(val);
                            }
                        }
                    }
                }

                walkJson(self.metaMoleculeInfo);

                // root node for the example
                example = self.core.getAttribute(nodeObject,'name').replace(/-/g, '_');
                example_node = self.core.getMetaType(nodeObject);
                example_type = self.core.getAttribute(example_node, 'name');
                self.logger.info('example name is: ', example);
                self.logger.info('example meta type is: ', example_type);

                self.save('change attributes');
                var childprocess = require("child-process-promise");
                example_py = example+'.py';
                example_path = path.join(example_dir, example_py);
                return childprocess.exec(PYTHON_EXE + ' ' + path.join(process.cwd(), example_path));
            })
            .then(function (output) {
                var stdout = output.stdout;
                console.log(stdout);
                stdout = stdout.slice(0, -2);
                var source = stdout;
                var destination = example_dir;
                var ncp = require('ncp').ncp;
                ncp.limit = 16;
                ncp(source, destination, function (err){
                if (err) {
                    return console.error(err);
                }
                    console.log('done!');
                });
               
                var chosen_css = fs.readFileSync(path.join(source, 'chosen.css'));
                var chosen_jquery_min_js = fs.readFileSync(path.join(source, 'chosen.jquery.min.js'));
                var imolecule_min_js = fs.readFileSync(path.join(source, 'imolecule.min.js'));
                var index_html = fs.readFileSync(path.join(source, 'index.html'));
                var jquery_1_11_1_min_js = fs.readFileSync(path.join(source, 'jquery-1.11.1.min.js'));
                var example_file = fs.readFileSync(path.join(example_dir, example_py));
                var server_css = fs.readFileSync(path.join(source, 'server.css'));
                // }
                return artifact.addFilesAsSoftLinks({
                    'metaMoleculeInfo.json': metaMoleculeInfoJson,
                    'chosen.css': chosen_css,
                    'chosen.jquery.min.js': chosen_jquery_min_js,
                    'imolecule.min.js': imolecule_min_js,
                    'index.html': index_html,
                    'jquery-1.11.1.min.js': jquery_1_11_1_min_js,
                    'example.py': example_file,
                    'server.css': server_css
                    });
            })
            .then(function (fileHash) {
                self.result.addArtifact(fileHash);
                return artifact.save()
            })
            .then(function (artifactHash) {
                self.result.addArtifact(artifactHash);
                self.createMessage(null, `<iframe src="/rest/blob/view/${artifactHash}/index.html" style="width: 100%; height: 100%; min-height: 400px"></iframe>`);
                self.result.setSuccess(true);
                callback(null, self.result);
            })
            .catch(function (err) {
                // (3)
                self.logger.error(err.stack);
                // Result success is false at invocation.
                callback(err, self.result);
            });
    };

    MoleculeCodeGenerator.prototype.loadNodeMap = function (node) {
        var self = this; 
        return self.core.loadSubTree(node)
           .then(function (nodeArr) {
               var nodes = {},
                   i;
               for (i = 0; i < nodeArr.length; i += 1) {
                   nodes[self.core.getPath(nodeArr[i])] = nodeArr[i];
               }

               return nodes;
           });
    };

    MoleculeCodeGenerator.prototype.makeid = function (){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var path = require('path');
    var fs = require('fs');
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    var mkdirSync = function (path) {
        try {
            fs.mkdirSync(path);
        } catch(e) {
            if ( e.code != 'EEXIST' ) throw e;
        }
    }
    var mkdirpSyncDir = function (dirpath) {
        var parts = dirpath.split(path.sep);
        for( var i = 1; i <= parts.length; i++ ) {
            mkdirSync( path.join.apply(null, parts.slice(0, i)) );
        }
    }
    mkdirpSyncDir(path.join('src', 'plugins', 'MoleculeCodeGenerator', 'example', text));
    return path.join('src', 'plugins', 'MoleculeCodeGenerator', 'example', text);
    }

    MoleculeCodeGenerator.prototype.makedir = function (text){
        var path = require('path');
        var fs = require('fs');
        var mkdirSync = function (path) {
            try {
                fs.mkdirSync(path);
            } catch(e) {
                if ( e.code != 'EEXIST' ) throw e;
            }
        }
        var mkdirpSyncDir = function (dirpath) {
            var parts = dirpath.split(path.sep);
            for( var i = 1; i <= parts.length; i++ ) {
                mkdirSync( path.join.apply(null, parts.slice(0, i)) );
            }
        }
        mkdirpSyncDir(path.join('src', 'plugins', 'MoleculeCodeGenerator', 'Templates', 'lib', text));
        return path.join('src', 'plugins', 'MoleculeCodeGenerator', 'Templates', 'lib', text);
    }

    MoleculeCodeGenerator.prototype.getMoleculeInfo = function (root, nodes, iter, indent) {
        var self = this,
            idOfMetaNode,
            nameOfMetaNode,
            xOfMetaNode,
            yOfMetaNode,
            zOfMetaNode,
            lengthOfMetaNode,
            capOfMetaNode,
            pyfileOfMetaNode,
            pyfile_dirOfMetaNode,
            pathOfMetaNode,
            isMeta,
            metaType,
            children = {},
            childrenPaths,
            childNode,
            child_obj,
            child_key,
            dstNode,
            srcNode,
            dstName,
            srcName,
            child={},
            i;

        indent = indent || '';

        nameOfMetaNode = self.core.getAttribute(root, 'name');
        xOfMetaNode = self.core.getAttribute(root, 'x');
        yOfMetaNode = self.core.getAttribute(root, 'y');
        zOfMetaNode = self.core.getAttribute(root, 'z');
        lengthOfMetaNode = self.core.getAttribute(root, 'length');
        capOfMetaNode = self.core.getAttribute(root, 'cap');
        pyfileOfMetaNode = self.core.getAttribute(root, 'pyfile');
        pyfile_dirOfMetaNode = self.core.getAttribute(root, 'pyfile_dir');
        pathOfMetaNode = self.core.getPath(root);
        idOfMetaNode = self.core.getRelid(root);
        isMeta = self.core.isMetaNode(root);

        childrenPaths = self.core.getChildrenPaths(root);
        // self.logger.info(indent, nameOfMetaNode, 'has', childrenPaths.length, 'children.');

        for (i = 0; i < childrenPaths.length; i += 1) {
            childNode = nodes[childrenPaths[i]];
            // self.logger.info('**********', childNode)
            child_obj = self.getMoleculeInfo(childNode, nodes, iter + 1, indent + '  ');
            // children.push(
            // self.logger.info('**********', child_obj)

            for (child_key in child_obj) {
                children[child_key] = child_obj[child_key];
                // self.logger.info('***afsadf*******', child_key)
                // self.logger.info('***asdfasdf*******', child_obj[child_key])
            }
            // );
        }

        if(iter == 1) {
            if (self.core.getAttribute(root, 'name') == 'ROOT') {
                child = {name: nameOfMetaNode, children: children};
                self.metaMoleculeInfo = child;
            }
            else {
                metaType = self.core.getAttribute(self.core.getMetaType(root), 'name');
                child = {name: nameOfMetaNode,
                         metaType: metaType,
                         children: children,
                         length: lengthOfMetaNode,
                         pyfile: pyfileOfMetaNode,
                         pyfile_dir: pyfile_dirOfMetaNode,
                         path: pathOfMetaNode
                         };
                self.metaMoleculeInfo = child;
            }
            // self.logger.info('******metaNodeInfo******', self.metaNodeInfo)
        } 
        else {
            if(!isMeta) {
                // metaType = self.core.getAttribute(self.core.getBase(root), 'name');  this is the base of pointers
                metaType = self.core.getAttribute(self.core.getMetaType(root), 'name');
                if(self.core.isConnection(root)) {
                    dstNode = self.core.getPointerPath(root, 'dst');
                    dstName = self.core.getAttribute(nodes[dstNode], 'name');
                    srcNode = self.core.getPointerPath(root, 'src');
                    srcName = self.core.getAttribute(nodes[srcNode], 'name');
                    // self.logger.info('**********', idOfMetaNode)
                    child[idOfMetaNode] = ({name: nameOfMetaNode, isMeta: isMeta, metaType: metaType, src: srcName, dst: dstName});
                } 
                else if(metaType == 'Atom') {
                    child[idOfMetaNode] = ({name: nameOfMetaNode,
                                            pos: [xOfMetaNode, yOfMetaNode, zOfMetaNode],
                                            isMeta: isMeta,
                                            metaType: metaType,
                                            cap: capOfMetaNode,
                                            pyfile: pyfileOfMetaNode,
                                            pyfile_dir: pyfile_dirOfMetaNode,
                                            path: pathOfMetaNode,
                                            children: children
                                            });
                }
                else if(metaType == 'Port') {
                    child[idOfMetaNode] = ({name: nameOfMetaNode,
                                            pos: [xOfMetaNode, yOfMetaNode, zOfMetaNode],
                                            isMeta: isMeta,
                                            metaType: metaType
                                            });
                }
                else if(metaType == 'Molecule') {
                    child[idOfMetaNode] = ({name: nameOfMetaNode,
                                            length: lengthOfMetaNode,
                                            pos: [xOfMetaNode, yOfMetaNode, zOfMetaNode],
                                            isMeta: isMeta,
                                            metaType: metaType,
                                            cap: capOfMetaNode,
                                            pyfile: pyfileOfMetaNode,
                                            pyfile_dir: pyfile_dirOfMetaNode,
                                            path: pathOfMetaNode,
                                            children: children
                                            });
                }
                else if(metaType == 'Polymer') {
                    child[idOfMetaNode] = ({name: nameOfMetaNode,
                                            length: lengthOfMetaNode,
                                            isMeta: isMeta,
                                            metaType: metaType,
                                            cap: capOfMetaNode,
                                            pyfile: pyfileOfMetaNode,
                                            pyfile_dir: pyfile_dirOfMetaNode,
                                            path: pathOfMetaNode,
                                            children: children
                                            });
                }
                else if(metaType == 'Copolymer') {
                    child[idOfMetaNode] = ({name: nameOfMetaNode,
                                            length: lengthOfMetaNode,
                                            isMeta: isMeta,
                                            metaType: metaType,
                                            cap: capOfMetaNode,
                                            pyfile: pyfileOfMetaNode,
                                            pyfile_dir: pyfile_dirOfMetaNode,
                                            path: pathOfMetaNode,
                                            children: children
                                            });
                }
                else {
                    child[idOfMetaNode] = ({name: nameOfMetaNode, isMeta: isMeta, metaType: metaType, children: children});
                }
            } 
            else {
                metaType = nameOfMetaNode;
                child[idOfMetaNode] = ({name: nameOfMetaNode, isMeta: isMeta, metaType: metaType, children: children});
            }
        }
 
        return child;
    };

    return MoleculeCodeGenerator;
});