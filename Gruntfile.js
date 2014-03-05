module.exports = function (grunt) {
    grunt.initConfig({
        coffee: {
            compile: {
                options: {
                    join: true
                },
                files: {
                    'functoids.js': [ 'src/*.coffee' ]
                }
            }
        },
        uglify: {
            prod: {
                files: {
                    'functoids.min.js': [ 'functoids.js' ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [ 'coffee:compile', 'uglify:prod' ]);
};
