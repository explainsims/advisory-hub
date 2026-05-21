export interface CaselCategory {
  id: string;
  title: string;
  description: string;
  bullets?: string[];
  subcategories?: { title: string; content: string }[];
}

export const CASEL_DATA: Record<string, CaselCategory> = {
  "self-management": {
    id: "self-management",
    title: "Self-Management",
    description: "*The abilities to manage one’s emotions, thoughts, and behaviors effectively in different situations and to achieve goals and aspirations.*\n\nThis includes the capacities to delay gratification, manage stress, and feel motivation and agency to accomplish personal and collective goals.",
    bullets: [
      "Managing one’s emotions",
      "Identifying and using stress management strategies",
      "Exhibiting self-discipline and self-motivation",
      "Setting personal and collective goals",
      "Using planning and organizational skills",
      "Showing the courage to take initiative",
      "Demonstrating personal and collective agency"
    ]
  },
  "responsible-decision-making": {
    id: "responsible-decision-making",
    title: "Responsible Decision-Making",
    description: "*The abilities to make caring and constructive choices about personal behavior and social interactions across diverse situations.*\n\nThis includes the capacities to consider ethical standards and safety concerns, and to evaluate the benefits and consequences of various actions for personal, social, and collective well-being.",
    bullets: [
      "Demonstrating curiosity and open-mindedness",
      "Learning how to make a reasoned judgment after analyzing information, data, and facts",
      "Identifying solutions for personal and social problems",
      "Anticipating and evaluating the consequences of one’s actions",
      "Recognizing how critical thinking skills are useful both inside and outside of school",
      "Reflecting on one’s role to promote personal, family, and community well-being",
      "Evaluating personal, interpersonal, community, and institutional impacts"
    ]
  },
  "relationship-skills": {
    id: "relationship-skills",
    title: "Relationship Skills",
    description: "*The abilities to establish and maintain healthy and supportive relationships and to effectively navigate settings with diverse individuals and groups.*\n\nThis includes the capacities to communicate clearly, listen actively, cooperate, work collaboratively to problem solve and negotiate conflict constructively, navigate settings with differing social and cultural demands and opportunities, provide leadership, and seek or offer help when needed.",
    bullets: [
      "Communicating effectively",
      "Developing positive relationships",
      "Demonstrating cultural competency",
      "Practicing teamwork and collaborative problem-solving",
      "Resolving conflicts constructively",
      "Resisting negative social pressure",
      "Showing leadership in groups",
      "Seeking or offering support and help when needed",
      "Standing up for the rights of others"
    ]
  },
  "social-awareness": {
    id: "social-awareness",
    title: "Social Awareness",
    description: "*The abilities to understand the perspectives of and empathize with others, including those from diverse backgrounds, cultures, and contexts.*\n\nThis includes the capacities to feel compassion for others, understand broader historical and social norms for behavior in different settings, and recognize family, school, and community resources and supports.",
    bullets: [
      "Taking others’ perspectives",
      "Recognizing strengths in others",
      "Demonstrating empathy and compassion",
      "Showing concern for the feelings of others",
      "Understanding and expressing gratitude",
      "Identifying diverse social norms, including unjust ones",
      "Recognizing situational demands and opportunities",
      "Understanding the influences of organizations and systems on behavior"
    ]
  },
  "self-awareness": {
    id: "self-awareness",
    title: "Self-Awareness",
    description: "*The abilities to understand one’s own emotions, thoughts, and values and how they influence behavior across contexts.*\n\nThis includes capacities to recognize one’s strengths and limitations with a well-grounded sense of confidence and purpose.",
    bullets: [
      "Integrating personal and social identities",
      "Identifying personal, cultural, and linguistic assets",
      "Identifying one’s emotions",
      "Demonstrating honesty and integrity",
      "Linking feelings, values, and thoughts",
      "Examining prejudices and biases",
      "Experiencing self-efficacy",
      "Having a growth mindset",
      "Developing interests and a sense of purpose"
    ]
  },
  "classrooms": {
    id: "classrooms",
    title: "Classrooms",
    description: "Research has shown that social and emotional competence can be enhanced using a variety of classroom-based approaches such as:\n\n(a) explicit instruction through which social and emotional skills and attitudes are taught and practiced in developmentally, contextually, and culturally responsive ways;\n\n(b) teaching practices such as cooperative learning and project-based learning; and\n\n(c) integration of SEL and academic curriculum such as language arts, math, science, social studies, health, and performing arts.\n\nHigh-quality SEL instruction has four elements represented by the acronym **SAFE**:",
    bullets: [
      "**Sequenced** – following a coordinated set of training approaches to foster the development of competencies;",
      "**Active** – emphasizing active forms of learning to help students practice and master new skills;",
      "**Focused** – implementing curriculum that intentionally emphasizes the development of SEL competencies; and",
      "**Explicit** – defining and targeting specific skills, attitudes, and knowledge."
    ],
    subcategories: [
      {
        title: "Environment",
        content: "SEL instruction is carried out most effectively in nurturing, safe environments characterized by positive, caring relationships among students and teachers. To facilitate age-appropriate and culturally responsive instruction, adults must understand and appreciate the unique strengths and needs of each student and support students’ identities. When adults incorporate students’ personal experiences and cultural backgrounds and seek their input, they create an inclusive classroom environment where students are partners in the educational process, elevating their own agency. Strong relationships between adults and students can facilitate co-learning, foster student and adult growth, and generate collaborative solutions to shared concerns."
      }
    ]
  },
  "schools": {
    id: "schools",
    title: "Schools",
    description: "Effectively integrating SEL schoolwide involves ongoing planning, implementation, evaluation, and continuous improvement by all members of the school community. SEL efforts both contribute to and depend upon a school climate where all students and adults feel respected, supported, and engaged.\n\nBecause the school setting includes many contexts—classrooms, hallways, cafeteria, playground, bus—fostering a healthy school climate and culture requires active engagement from all adults and students. A strong school culture is rooted in students’ sense of belonging, with evidence that suggests that it plays a crucial role in students’ engagement. SEL also offers an opportunity to enhance existing systems of student support by integrating SEL goals and practices with universal, targeted, and intensive academic and behavioral supports. By coordinating and building upon SEL practices and programs, schools can create an environment that infuses SEL into every part of students’ educational experience and promotes positive social, emotional, and academic outcomes for all students."
  },
  "families": {
    id: "families",
    title: "Families & Caregivers",
    description: "When schools and families form authentic partnerships, they can build strong connections that reinforce students’ social and emotional development. Families and caregivers are children’s first teachers, and bring deep expertise about their development, experiences, culture, and learning needs. These insights and perspectives are critical to informing, supporting, and sustaining SEL efforts. Research suggests that evidence-based SEL programs are more effective when they extend into the home, and families are far more likely to form partnerships with schools when their schools’ norms, values, and cultural representations reflect their own experiences. Schools need inclusive decision-making processes that ensure that families—particularly those from historically marginalized groups—are part of planning, implementing, and continuously improving SEL.\n\nSchools can also create other avenues for family partnership that may include creating ongoing two-way communication with families, helping caregivers understand child development, helping teachers understand family backgrounds and cultures, providing opportunities for families to volunteer in schools, extending learning activities and discussions into homes, and coordinating family services with community partners. These efforts should engage families in understanding, experiencing, informing, and supporting the social and emotional development of their students."
  },
  "communities": {
    id: "communities",
    title: "Communities",
    description: "Community partners often provide safe and developmentally rich settings for learning and development, have deep understanding of community needs and assets, are seen as trusted partners by families and students, and have connections to additional supports and services that school and families need. Community programs also offer opportunities for young people to practice their social and emotional skills in settings that are both personally relevant and can open opportunities for their future. To integrate SEL efforts across the school day and out-of-school time, school staff and community partners should align on common language and coordinate strategies and communication around SEL-related efforts and initiatives."
  },
  "sel": {
    id: "sel",
    title: "Social & Emotional Learning",
    description: "Social and emotional learning (SEL) is an integral part of education and human development. SEL is the process through which all young people and adults acquire and apply the knowledge, skills, and attitudes to develop healthy identities, manage emotions and achieve personal and collective goals, feel and show empathy for others, establish and maintain supportive relationships, and make responsible and caring decisions.\n\nSEL advances educational equity and excellence through authentic school-family-community partnerships to establish learning environments and experiences that feature trusting and collaborative relationships, rigorous and meaningful curriculum and instruction, and ongoing evaluation. SEL can help address various forms of inequity and empower young people and adults to co-create thriving schools and contribute to safe, healthy, and just communities."
  }
}
