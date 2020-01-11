namespace :yarn do
  desc 'Install'
  task :build do
    on roles(:app) do
      execute 'yarn install'
    end
  end
end
