namespace :employees do
  desc "Generate first_names.txt and last_names.txt for seeding"
  task generate_name_files: :environment do
    require "faker"
    require "fileutils"

    output_dir = Rails.root.join("db/seeds")
    first_names_path = output_dir.join("first_names.txt")
    last_names_path = output_dir.join("last_names.txt")

    FileUtils.mkdir_p(output_dir)

    if File.exist?(first_names_path) && File.exist?(last_names_path)
      puts "Name files already exist. Skipping generation."
      next
    end

    Faker::UniqueGenerator.clear

    first_names = Array.new(100) { Faker::Name.unique.first_name }.sort
    last_names = Array.new(100) { Faker::Name.unique.last_name }.sort

    File.write(first_names_path, "#{first_names.join("\n")}\n") unless File.exist?(first_names_path)
    File.write(last_names_path, "#{last_names.join("\n")}\n") unless File.exist?(last_names_path)

    puts "Created #{first_names_path} with #{first_names.size} first names" unless File.exist?(first_names_path)
    puts "Created #{last_names_path} with #{last_names.size} last names" unless File.exist?(last_names_path)
  end
end
