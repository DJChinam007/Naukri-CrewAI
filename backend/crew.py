from datetime import datetime
from typing import Callable
from langchain_together import ChatTogether
from langchain_openai import ChatOpenAI
from agents import CompanyResearchAgents
from job_manager import append_event
from tasks import CompanyResearchTasks
from crewai import Crew


class CompanyResearchCrew:
    def __init__(self, job_id: str):
        self.job_id = job_id
        self.crew = None
        self.llm = ChatOpenAI(model="gpt-3.5-turbo")
        # self.llm = ChatTogether(model="meta-llama/Llama-3-70b-chat-hf")

    def setup_crew(self, companies: list[str], positions: list[str]):
        agents = CompanyResearchAgents()
        tasks = CompanyResearchTasks(
            job_id=self.job_id)

        research_manager = agents.research_manager(
            companies, positions)
        company_research_agent = agents.company_research_agent()

        company_research_tasks = [
            tasks.company_research(company_research_agent, company, positions)
            for company in companies
        ]

        manage_research_task = tasks.manage_research(
            research_manager, companies, positions, company_research_tasks)

        self.crew = Crew(
            agents=[research_manager, company_research_agent],
            tasks=[*company_research_tasks, manage_research_task],
            verbose=2,
        )

    def kickoff(self):
        if not self.crew:
            append_event(self.job_id, "Crew not set up")
            return "Crew not set up"

        append_event(self.job_id, "Task Started")
        try:
            results = self.crew.kickoff()
            append_event(self.job_id, "Task Complete")
            return results
        except Exception as e:
            append_event(self.job_id, f"An error occurred: {e}")
            return str(e)
