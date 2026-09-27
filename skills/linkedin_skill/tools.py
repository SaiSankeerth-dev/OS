"""LinkedIn skill tools. Implementation lives in server/tools/; this
module is the skill's declared entry point for the SkillLoader."""
from server.tools.linkedin_tool import (
    LINKEDIN_DRAFT_SPEC,
    format_linkedin_draft,
    generate_linkedin_draft,
)

TOOLS = [
    (LINKEDIN_DRAFT_SPEC, generate_linkedin_draft, format_linkedin_draft),
]
