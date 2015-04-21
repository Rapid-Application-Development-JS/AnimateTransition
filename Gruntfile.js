module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy : {
            build: {
                files: [
                    {src: 'src/<%= pkg.name %>.source.js', dest: 'src/<%= pkg.name %>.js'}
                ]
            }
        },
        comments: {
            build: {
                options: {
                    singleline: true,
                    multiline: true
                },
                src: [ 'src/<%= pkg.name %>.js']
            }
        },
        uglify: {
            build: {
                options: {
                },
                files: [
                    {
                        dest: 'src/<%= pkg.name %>.min.js',
                        src: 'src/<%= pkg.name %>.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-stripcomments');

    grunt.registerTask('release', ['copy:build', 'comments:build', 'uglify:build']);
};