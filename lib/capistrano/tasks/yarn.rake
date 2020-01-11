namespace :yarn do
  desc 'Install'
  task :install do
    on roles(:app) do
      execute 'yarn install'
    end
  end
end
