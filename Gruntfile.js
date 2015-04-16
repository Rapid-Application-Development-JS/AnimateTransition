module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
        },
        clean: {
            dev: {
                files: [
                    {src: ['src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.<%= pkg.version %>.min.js']}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('dev', ['clean:dev']);
    grunt.registerTask('release', ['uglify:build']);
};