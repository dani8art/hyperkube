'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-release-github');

    grunt.loadNpmTasks('grunt-banner');

    grunt.loadNpmTasks('grunt-dockerize');

    // Project configuration.
    grunt.initConfig({
        //Load configurations
        pkg: grunt.file.readJSON('package.json'),

        readmeHeaderTemplate: grunt.file.read('extra/readme-header-template', {
            encoding: 'utf8'
        }).toString(),

        //Add license notice and latest release notes
        usebanner: {
            readme: {
                options: {
                    position: 'top',
                    banner: '# HYPERKUBE ready to work configuration\n\n<%= readmeHeaderTemplate %>',
                    replace: /#\sHYPERKUBE\sready\sto\swork\sconfiguration(\s||.)+/g,
                    linebreak: false
                },
                files: {
                    src: ['README.md']
                }
            }
        },

        //Make a new release on github
        //"grunt release" for pacth version
        //"grunt release:minior" for minior version
        //"grunt release:major" for major version
        release: {
            options: {
                changelog: true, //NOT CHANGE
                changelogFromGithub: true, //NOT CHANGE
                githubReleaseBody: 'See [CHANGELOG.md](./CHANGELOG.md) for details.', //NOT CHANGE
                npm: false, //CHANGE TO TRUE IF YOUR PROJECT IS A NPM MODULE 
                additionalFiles: ['README.md'],
                //npmtag: true, //default: no tag
                beforeBumpTasks: [], // IS NOT READY YET
                afterBumpTasks: ['buildOn', 'usebanner'], // IS NOT READY YET
                beforeReleaseTasks: [], // IS NOT READY YET
                afterReleaseTasks: [], // IS NOT READY YET
                updateVars: ['pkg'], //NOT CHANGE
                github: {
                    repo: "dani8art/hyperkube",
                    accessTokenVar: "GITHUB_ACCESS_TOKEN", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                    usernameVar: "GITHUB_USERNAME" //SET ENVIRONMENT VARIABLE WITH THIS NAME
                }
            }
        },

        //USE THIS TASK FOR BUILDING AND PUSHING docker images
        dockerize: {
            'darteaga-hyperkube-latest': {
                options: {
                    auth: {
                        email: "DOCKER_HUB_EMAIL", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        username: "DOCKER_HUB_USERNAME", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        password: "DOCKER_HUB_PASSWORD" //SET ENVIRONMENT VARIABLE WITH THIS NAME
                    },
                    name: 'hyperkube',
                    push: true
                }
            },
            'darteaga-hyperkube-version': {
                options: {
                    auth: {
                        email: "DOCKER_HUB_EMAIL", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        username: "DOCKER_HUB_USERNAME", //SET ENVIRONMENT VARIABLE WITH THIS NAME
                        password: "DOCKER_HUB_PASSWORD" //SET ENVIRONMENT VARIABLE WITH THIS NAME
                    },
                    name: 'hyperkube',
                    tag: '<%= pkg.version %>',
                    push: true
                }
            }
        }
    });

    grunt.registerTask('buildOn', function () {
        grunt.config('pkg.buildOn', grunt.template.today("yyyy-mm-dd"));
        grunt.file.write('package.json', JSON.stringify(grunt.config('pkg'), null, 2));
    });

    grunt.registerTask('build', ['dockerize']);

};