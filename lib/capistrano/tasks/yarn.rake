namespace :yarn do
  desc 'Install'
  task :install do
    on roles(:app) do
      execute "cd #{release_path}; yarn install"
    end
  end
end

before 'deploy:updated', 'yarn:install'
