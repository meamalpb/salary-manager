class SalaryInsightsController < ApplicationController
  def country_stats
    render json: service.country_stats(params[:country])
  end

  def job_title_stats
    render json: service.job_title_stats(
      country: params[:country],
      job_title: params[:job_title]
    )
  end

  private

  def service
    SalaryInsightsService.new
  end
end
