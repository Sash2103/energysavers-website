import { CASES, FEATURED, caseByKey } from '@/data/cases';
import CaseArticle from '@/components/shared/CaseArticle';

// Featured case write-ups, then the register of every case (each opens in the case sheet).
export default function CaseStudies() {
  return (
    <>
      <h2 className="section-title" id="cases-title">Case <span className="accent">studies</span></h2>
      {/* TODO(owner): the workplan figures come from the old site's diagrams. Confirm whether they were achieved or projected (Emicool's is labelled "Recommended"). */}
      {FEATURED.map(key => <CaseArticle c={caseByKey(key)} key={key} />)}
      <div className="register">
        <table className="register__table">
          <caption className="vh">All case studies</caption>
          <thead>
            <tr><th scope="col">Year</th><th scope="col">Project</th><th scope="col">Scope</th><th scope="col">Result</th></tr>
          </thead>
          <tbody>
            {CASES.map(c => (
              <tr key={c.key}>
                <td className="register__year">{c.register.year}</td>
                <th scope="row"><button className="register__open" type="button" data-case={c.key}>{c.register.name}</button></th>
                <td>{c.register.scope}</td>
                <td className="register__result">{c.register.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Case studies that are not featured above. They open in the case sheet. */}
      <div className="case-archive" id="case-archive" hidden>
        {CASES.filter(c => !FEATURED.includes(c.key)).map(c => <CaseArticle c={c} key={c.key} />)}
      </div>
    </>
  );
}
