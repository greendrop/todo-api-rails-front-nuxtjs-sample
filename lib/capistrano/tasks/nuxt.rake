namespace :nuxt do
  def nuxt_execute(cmd)
    execute :sudo, :systemctl, cmd, "#{fetch(:application)}"
  end

  desc 'Build'
  task :build do
    on roles(:app) do
      within release_path do
        execute :yarn, :run, :build
      end
    end
  end

  desc 'Start'
  task :start do
    on roles(:app) do
      nuxt_execute(:start)
    end
  end

  desc 'Stop'
  task :stop do
    on roles(:app) do
      nuxt_execute(:stop)
    end
  end

  desc 'Restart'
  task :restart do
    on roles(:app) do
      nuxt_execute(:restart)
    end
  end
end

after 'deploy:updated', 'nuxt:build'
