const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.jsx', 'utf8');

const target = `{groups.map(g => <option key={g.id                               {/* duplicate path inputs removed */}
                                 
                                <div style={{ display: 'flex', flexDirection:'column', gap:'8px', marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'8px' }}>Direction:'column', gap:'8px', marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'8px' }}>`;

const replacement = `{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                   </select>
                               </div>

                               {/* duplicate path inputs removed */}
                                
                               <div style={{ display: 'flex', flexDirection:'column', gap:'8px', marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'8px' }}>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('frontend/src/App.jsx', code);
    console.log("Success exact match");
} else {
    // fuzzy fallback
    const lines = code.split('\\n');
    let out = [];
    for(let i=0; i<lines.length; i++) {
        if (lines[i].includes('{groups.map(g => <option key={g.id')) {
            out.push("                                       {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}");
            out.push("                                   </select>");
            out.push("                               </div>");
            out.push("                               ");
            out.push("                               {/* duplicate path inputs removed */}");
            out.push("                                ");
            out.push("                               <div style={{ display: 'flex', flexDirection:'column', gap:'8px', marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'8px' }}>");
            i += 2; // skip the next 2 broken lines
        } else {
            out.push(lines[i]);
        }
    }
    fs.writeFileSync('frontend/src/App.jsx', out.join('\\n'));
    console.log("Success fuzzy match");
}
